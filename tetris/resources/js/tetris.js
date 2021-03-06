var tetris = (function ($, Model) {
	var blocks = Model.blocks;
	var dropCenter = Model.dropCenter;
	var block = null;
	var rotateState = 0;
	var timer, interval = 1;
	var mainBody = $('.tetris'), mainBoard = [], mainLines = [];
	var nextBodies = [$('.next-first'), $('.next-second'), $('.next-third')], nextBoards = [], nextBlocks = [];
	var holdBody = $('.hold-block'), holdBoard = [], holdBlock = null;
	var clearLinesCount = 0;
	var isOver, isHoldable;
	var keypad = $('.mobile-keypad'), intro = keypad.find('.intro');

	var initBoard = function () {
		let i;
		mainBoard = makeBoard(mainBody.find('.line'), mainLines);

		for (i=0; i<nextBodies.length; i++) {
			nextBoards.push(makeBoard(nextBodies[i].find('.line')));
		}
		
		holdBoard = makeBoard(holdBody.find('.line'));
		
		function makeBoard(rows, lines) {
			let i, j, tmp;
			let board = [], boardCell;
			for (i=0; i<rows.length; i++) {
				tmp = [];
				boardCell = $(rows[i]).find('.cell');
				for (j=0; j<boardCell.length; j++) {
					tmp.push($(boardCell[j]));
				}
				board.push(tmp);
				if (lines) {
					lines.push($(rows[i]));
				}
			}
			
			return board;
		}
	};

	//block을 board에 그림
	var drawBlock = function (target, board, curRotateState) {
		let i, posY, posX;
		if (typeof curRotateState === 'undefined') {
			curRotateState = rotateState;
		}
		for (i=0; i<4; i++) {
			posY = target.position.y + target.type.rotateState[curRotateState][i][0];
			posX = target.position.x + target.type.rotateState[curRotateState][i][1];
			if (posY > -1) {
				board[posY][posX].addClass(target.type.name).addClass('block');
			}
		}
	};
	var drawNextBlock = function () {
		let i;
		for (i=0; i<3; i++) {
			drawBlock(nextBlocks[2-i], nextBoards[i], 0);
		}
	};
	//block을 board에서 지움
	var eraseBlock = function (target, board, curRotateState) {
		let i, posY, posX;
		if (typeof curRotateState === 'undefined') {
			curRotateState = rotateState;
		}
		for (i=0; i<4; i++) {
			posY = target.position.y + target.type.rotateState[curRotateState][i][0];
			posX = target.position.x + target.type.rotateState[curRotateState][i][1];
			if (posY > -1) {
				board[posY][posX].removeClass(target.type.name).removeClass('block');
			}
		}
	};
	var eraseNextBlock = function () {
		let i;
		for (i=0; i<3; i++) {
			eraseBlock(nextBlocks[2-i], nextBoards[i], 0);
		}
	};
	//꽉 찬 line clear
	var clearLines = function () {
		let i, j, isClear, tmp;
		for (i=0; i<16; i++) {
			isClear = true;
			for (j=0; j<10; j++) {
				if (!mainBoard[i][j].hasClass('block')) {
					isClear = false;
				}
			}
			if (isClear) {
				mainLines[i].find('.cell').removeClass('block block-0 block-1 block-2 block-3 block-4 block-5 block-6');
				tmp = mainLines[i].detach();
				mainBody.prepend(tmp);
				mainLines.unshift(mainLines.splice(i, 1)[0]);
				mainBoard.unshift(mainBoard.splice(i, 1)[0]);
				if (++clearLinesCount % 10 === 0) {
					interval = (interval < 10) && (interval + 1) || interval;
				}
				console.log(clearLinesCount);
			}
		}
	};
	//GameOver 확인
	var checkEmptySpace = function () {
		let i, posY, posX;
		for (i=0; i<4; i++) {
			posY = block.position.y + block.type.rotateState[rotateState][i][0];
			posX = block.position.x + block.type.rotateState[rotateState][i][1];
			if (posY > -1 && mainBoard[posY][posX].hasClass('block')) {
				return false;
			}
		}
		return true;
	}
	//direction에 벽 또는 block이 있는지 체크
	var checkBlock = function (direction) {
		let i, ea = block.type.extraArea[rotateState][direction];
		for (i=0; i<ea.length; i++) {
			let posY = block.position.y + ea[i][0];
			let posX = block.position.x + ea[i][1];
			if (posY > 15 || posX < 0 || posX > 9 || (posY > 0 && mainBoard[posY][posX].hasClass('block'))) {
				return false;
			}
		}
		return true;
	}
	var checkDownBlock = function () {
		return checkBlock('down');
	};
	var checkLeftBlock = function () {
		return checkBlock('left');
	};
	var checkRightBlock = function () {
		return checkBlock('right');
	};
	//y,x 방향으로 이동
	var moveBlock = function (posY, posX) {
		eraseBlock(block, mainBoard);
		block.position.y += posY;
		block.position.x += posX;
		drawBlock(block, mainBoard);
	}
	var moveLeft = function () {
		if (checkLeftBlock()) {
			moveBlock(0, -1);
		}
	};
	var moveRight = function () {
		if (checkRightBlock()) {
			moveBlock(0, 1);
		}
	};
	//아래로 1칸 내려감
	var blockDown = function () {
		if (checkDownBlock()) {
			moveBlock(1, 0);
			dropBlock();
		} else {
			clearLines();
			createNewBlock();
		}
	}
	//keydown 이벤트 콜백
	var moveDown = function () {
		clearTimeout(timer);
		blockDown();
	};
	//keydown spacebar 콜백
	var moveToBottom = function () {
		clearTimeout(timer);
		eraseBlock(block, mainBoard);
		while (true) {
			if (checkDownBlock()) {
				block.position.y += 1;
			} else {
				break;
			}
		}
		drawBlock(block, mainBoard);
		blockDown();
	};
	//block 회전
	var rotateBlock = function (targetRotateState) {
		let targetBlockRotateState = block.type.rotateState[targetRotateState];
		let i, targetY, targetX, isRotatable = true;
		
		eraseBlock(block, mainBoard);
		for (i=0; i<4; i++) {
			targetY = block.position.y + targetBlockRotateState[i][0];
			targetX = block.position.x + targetBlockRotateState[i][1];
			if (targetX < 0 || targetX > 9 || (targetY > 0 && mainBoard[targetY][targetX].hasClass('block'))) {
				isRotatable = false;
			}
		}
		
		if (isRotatable) {
			rotateState = targetRotateState;
		}
		drawBlock(block, mainBoard);
	}
	var rotateRight = function () {
		rotateBlock((rotateState + 1) % 4);
	};
	var rotateLeft = function () {
		rotateBlock((rotateState + 3) % 4);
	};
	//next block 초기화 - 3개 생성 후 그리기
	var setNextBlocks = function () {
		let i;
		for (i=0; i<3; i++) {
			nextBlocks.push(new Model.Block(Math.floor(Math.random() * 7)));
		}
		drawNextBlock();
	};
	//next block에서 꺼내온 뒤 다음블럭 생성
	var getNextBlock = function () {
		let tmpBlock;
		eraseNextBlock();
		tmpBlock = nextBlocks.pop();
		if (tmpBlock.type.name === 'block-3') {
			tmpBlock.position.y = 0;
			tmpBlock.position.x = 4;
		} else {
			tmpBlock.position.y = 0;
			tmpBlock.position.x = 5;
		}
		
		nextBlocks.unshift(new Model.Block(Math.floor(Math.random() * 7)));
		drawNextBlock();
		
		return tmpBlock;
	};
	//새 블럭 생성 - next block에서 꺼낸 후 next block 추가
	var createNewBlock = function () {
		block = getNextBlock();
		rotateState = 0;
		if (checkEmptySpace()) {
			isHoldable = true;
			if (checkDownBlock()) {
				dropBlock();
			}
		} else {
			alert('Game is Over! Press F5 key Please');
			endGame();
		}
		drawBlock(block, mainBoard);
	};
	//block 타이머 설정
	var dropBlock = function () {
		timer = setTimeout(_ => {
			blockDown();
		}, 1000/interval);
	};
	//hold 기능
	var changeHoldBlock = function () {
		let tmpBlock = block;
		clearTimeout(timer);
		eraseBlock(block, mainBoard);
		if (holdBlock) {
			eraseBlock(holdBlock, holdBoard, 0);
			block = holdBlock;
		} else {
			block = getNextBlock();
		}
		
		holdBlock = tmpBlock;
		if (block.type.name === 'block-3') {
			block.position.y = 0;
			block.position.x = 4;
		} else {
			block.position.y = 0;
			block.position.x = 5;
		}
		holdBlock.position.y = 1;
		holdBlock.position.x = 2;
		rotateState = 0;
		
		drawBlock(holdBlock, holdBoard, 0);
		drawBlock(block, mainBoard);
		dropBlock();
		isHoldable = false;
	}

	var attachEvent = function () {
		$('body').on('keydown', event => {
			let key = event.key;
			eventDistributor(key);
		});
		
		keypad.on('click', '.keypad', event => {
			let target = $(event.target);
			eventDistributor(target.data('key'));
		});
		
		function eventDistributor(key) {
			if (key === 'ArrowUp') {
				rotateRight();
			} else if (key === 'ArrowLeft') {
				moveLeft();
			} else if (key === 'ArrowRight') {
				moveRight();
			} else if (key === 'ArrowDown') {
				moveDown();
			} else if (key === ' ') {
				moveToBottom();
			} else if (key === 'z') {
				rotateLeft();
			} else if (key === 'Shift') {
				if (isHoldable) {
					changeHoldBlock();
				}
			} else if (key === 'Escape') {
				intro.hide();
				startGame();
			}
		}
	};
	var detachEvent = function () {
		$('body').off('keydown');
	}

	var startGame = function () {
		isOver = false;
		createNewBlock();
	}
	var endGame = function () {
		clearTimeout(timer);
		detachEvent();
	}
	var init = function () {
		initBoard();
		setNextBlocks();
		attachEvent();
	};
	
	init();
})(jQuery, model);
