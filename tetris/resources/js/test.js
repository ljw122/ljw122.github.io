(function ($, Model) {
	var blocks = Model.blocks;
	var dropCenter = Model.dropCenter;

	//blockIndex : 생성할 블록 번호(0-6)
	//board : 블록을 그릴 container
	function Block(blockIndex, board) {
		this.block = blocks[blockIndex];
		this.board = board;
	}
	Block.prototype.position = {
		y: dropCenter[0],
		x: dropCenter[1]
	};
	Block.prototype.rotateState = 0;
	
	Block.prototype._drawBlock = function () {
		let i, posY, posX;
		let block = this.block;
		for (i=0; i<4; i++) {
			posY = block.position.y + block.type.rotateState[rotateState][i][0];
			posX = block.position.x + block.type.rotateState[rotateState][i][1];
			if (posY > -1) {
				this.board[posY][posX].addClass(block.type.name).addClass('block');
			}
		}
	};
	Block.prototype._eraseBlock = function () {
		let i, posY, posX;
		let block = this.block;
		for (i=0; i<4; i++) {
			posY = block.position.y + block.type.rotateState[rotateState][i][0];
			posX = block.position.x + block.type.rotateState[rotateState][i][1];
			if (posY > -1) {
				this.board[posY][posX].removeClass(block.type.name).removeClass('block');
			}
		}
	};
	
	Block.prototype._moveBlock = function (posY, posX) {
		let block = this.block;
		this._eraseBlock();
		block.position.y += posY;
		block.position.x += posX;
		this._drawBlock();
	}
	Block.prototype.moveLeft = function () {
		
	}
	
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
	var eraseBlock = function () {
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
		eraseBlock();
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
		eraseBlock();
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
	
	var rotateBlock = function (targetRotateState) {
		let targetBlockRotateState = block.type.rotateState[targetRotateState];
		let i, targetY, targetX, isRotatable = true;
		
		eraseBlock();
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
	}
	var rotateRight = function () {
		rotateBlock((rotateState + 1) % 4);
	};
	var rotateLeft = function () {
		rotateBlock((rotateState + 3) % 4);
	};
	
})(jQuery, model);