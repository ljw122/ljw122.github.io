var tetris = (function ($, Model) {
	var blocks = Model.blocks;
	var dropCenter = Model.dropCenter;
	var block = null;
	var rotateState = 0;
	var timer, interval = 1;
	var board = [];

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
		}
	};

	//block을 board에 그림
	var drawBlock = function () {
		let i;
		for (i=0; i<4; i++) {
			board[block.position.y + block.type.rotateState[rotateState][i][0]][block.position.x + block.type.rotateState[rotateState][i][1]].addClass(block.type.name).addClass('block');
		}
	};
	//block을 board에서 지움
	var undrawBlock = function () {
		let i;
		for (i=0; i<4; i++) {
			board[block.position.y + block.type.rotateState[rotateState][i][0]][block.position.x + block.type.rotateState[rotateState][i][1]].removeClass(block.type.name).removeClass('block');
		}
	};
	//direction에 벽 또는 block이 있는지 체크
	var checkBlock = function (direction) {
		let i, ea = block.type.extraArea[rotateState][direction];
		for (i=0; i<ea.length; i++) {
			let posY = block.position.y + ea[i][0];
			let posX = block.position.x + ea[i][1];
			if (posY > 15 || posX < 0 || posX > 9 || !board[posY][posX] || board[posY][posX].hasClass('block')) {
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
		moveBlock(1, 0);
		if (checkDownBlock()) {
			dropBlock();
		} else {
			createNewBlock();
		}
	}
	var moveDown = function () {
		if (checkDownBlock()) {
			clearTimeout(timer);
			blockDown();
		}
	};
	var rotateRight = function () {
		undrawBlock();
		rotateState = (rotateState + 1) % 4;
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
