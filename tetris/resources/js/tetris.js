var tetris = (function ($, Model) {
	var blocks = Model.blocks;
	var dropCenter = Model.dropCenter;
	var block = null;
	var rotateState = 0;
	var timer, interval = 1;
	var body = $('.tetris'), board = [], lines = [];

	var initBoard = function () {
		let i, j, tmp;
		let boardRow = $('.line');
		let boardCell = null;
		for (i=0; i<boardRow.length; i++) {
			tmp = [];
			boardCell = $(boardRow[i]).find('.cell');
			for (j=0; j<boardCell.length; j++) {
				tmp.push($(boardCell[j]));
			}
			board.push(tmp);
			lines.push($(boardRow[i]));
		}
	};

	//block을 board에 그림
	var drawBlock = function () {
		let i, posY, posX;
		for (i=0; i<4; i++) {
			posY = block.position.y + block.type.rotateState[rotateState][i][0];
			posX = block.position.x + block.type.rotateState[rotateState][i][1];
			if (posY > -1) {
				board[posY][posX].addClass(block.type.name).addClass('block');
			}
		}
	};
	//block을 board에서 지움
	var undrawBlock = function () {
		let i, posY, posX;
		for (i=0; i<4; i++) {
			posY = block.position.y + block.type.rotateState[rotateState][i][0];
			posX = block.position.x + block.type.rotateState[rotateState][i][1];
			if (posY > -1) {
				board[posY][posX].removeClass(block.type.name).removeClass('block');
			}
		}
	};
	var clearLines = function () {
		let i, j, isClear, tmp;
		for (i=0; i<16; i++) {
			isClear = true;
			for (j=0; j<10; j++) {
				if (!board[i][j].hasClass('block')) {
					isClear = false;
				}
			}
			if (isClear) {
				lines[i].find('.cell').removeClass('block block-0 block-1 block-2 block-3 block-4 block-5 block-6');
				tmp = lines[i].detach();
				body.prepend(tmp);
				lines.unshift(lines.splice(i, 1)[0]);
				board.unshift(board.splice(i, 1)[0]);
			}
		}
	};
	//direction에 벽 또는 block이 있는지 체크
	var checkBlock = function (direction) {
		let i, ea = block.type.extraArea[rotateState][direction];
		for (i=0; i<ea.length; i++) {
			let posY = block.position.y + ea[i][0];
			let posX = block.position.x + ea[i][1];
			if (posY > 15 || posX < 0 || posX > 9 || (posY > 0 && board[posY][posX].hasClass('block'))) {
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
		undrawBlock();
		block.position.y += posY;
		block.position.x += posX;
		drawBlock();
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
	var blockDown = function () {
		if (checkDownBlock()) {
			moveBlock(1, 0);
			dropBlock();
		} else {
			clearLines();
			createNewBlock();
		}
	}
	var moveDown = function () {
		clearTimeout(timer);
		blockDown();
	};
	var moveToBottom = function () {
		clearTimeout(timer);
		undrawBlock();
		while (true) {
			if (checkDownBlock()) {
				block.position.y += 1;
			} else {
				break;
			}
		}
		drawBlock();
		blockDown();
	};
	var rotateRight = function () {
		let targetRotateState = (rotateState + 1) % 4;
		let targetBlockRotateState = block.type.rotateState[targetRotateState];
		let i, targetY, targetX, isRotatable = true;

		undrawBlock();
		for (i=0; i<4; i++) {
			targetY = block.position.y + targetBlockRotateState[i][0];
			targetX = block.position.x + targetBlockRotateState[i][1];
			if (targetX < 0 || targetX > 9 || (targetY > 0 && board[targetY][targetX].hasClass('block'))) {
				isRotatable = false;
			}
		}

		if (isRotatable) {
			rotateState = targetRotateState;
		}
		drawBlock();
	};
	var rotateLeft = function () {
		rotateState = (rotateState - 1) % 4;
	};

	var createNewBlock = function () {
		let newBlock = {
			type: blocks[Math.floor(Math.random() * 7)],
			position: {
				y: dropCenter[0],
				x: dropCenter[1]
			}
		};
		block = newBlock;
		if (block.type.name === 'block-3') {
			block.position.y = 0;
			block.position.x = 4;
		}
		rotateState = 0;
		drawBlock();
		if (checkDownBlock()) {
			dropBlock();
		}
	};
	var dropBlock = function () {
		timer = setTimeout(_ => {
			blockDown();
		}, 1000/interval);
	};
	var attachEvent = function () {
		$('html').on('keydown', event => {
			let key = event.key;
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
			}
		});
	};
	var init = function () {
		initBoard();
		attachEvent();
		createNewBlock();
	};
	init();
})(jQuery, model);
