//-----------------------------------------------------------------------------
// SRPG_UX_Cursor_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPG cursor, movement, and selection upgrades, edited by OhisamaCraft.
 * @author Dr. Q
 *
 * @param Cursor-Style Movement
 * @desc Make the cursor move like a cursor
 * @type boolean
 * @default true
 * 
 * @param Cursor Delay
 * @desc Frame delay for cursor movement
 * @parent Cursor-Style Movement
 * @type number
 * @default 8
 *
 * @param Cursor Speed
 * @desc Cursor movement speed- uses RMMV event speeds
 * @parent Cursor-Style Movement
 * @type number
 * @default 6
 *
 *
 * @param Animate Cursor
 * @desc Makes the cursor animate automatically
 * @type boolean
 * @default true
 *
 * @param Animate Delay
 * @desc Frame delay between cursor frames
 * @parent Animate Cursor
 * @type number
 * @default 15
 *
 *
 * @param Start On Next Actor
 * @desc Move to the next actor automatically after finishing an action
 * @type boolean
 * @default true
 *
 *
 * @param Switch Actor While Moving
 * @desc Select a different actor while moving to move them instead
 * @type boolean
 * @default true
 *
 *
 * @param Quick Attack
 * @desc Select an enemy while moving to target them with an attack
 * Requires SRPG_RangeControl.js
 * @type boolean
 * @default true
 *
 *
 * @param Quick Target Switch
 * @desc Use Page Up / Page Down to cycle through targets
 * @type boolean
 * @default true
 * 
 * @param Quick Switch From Preview
 * @desc Cycle through targets from the battle prediction
 * Does not apply to AoEs or skill that can target map cells
 * @parent Quick Target Switch
 * @type boolean
 * @default false
 *
 *
 * @param Auto Target
 * @desc Cursor starts on a targetable unit, if one is available
 * @type boolean
 * @default true
 *
 * @param Auto Select
 * @desc Automatically selects the first valid target (Auto-Target must be on)
 * Does not apply to AoEs or skill that can target map cells
 * @parent Auto Target
 * @type select
 * @option Never
 * @value 0
 * @option Self-Target Only
 * @value 1
 * @option Always
 * @value 2
 * @default 0
 *
 *
 * @help
 * copyright 2020 SRPG Team. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * An assortment of changes and settings to make combat
 * quicker and cleaner
 * 
 * Options:
 *
 * - Cursor-Style Movement: The cursor moves quickly from
 *   one cell to the next with a sound effect. Cursor Delay
 *   controls how long it pauses after each movement, and
 *   Cursor Speed determines just how quickly it moves.
 *   This may conflict with SRPG_etcMod's cursor-style movement
 *
 * - Animate Cursor: Makes the map cursor animate even when
 *   not moving. Animate Delay controls how long it stays
 *   on each frame.
 *
 * - Quick Target: Pressing page up or page down cycles
 *   through controllable units on the actor phase. While
 *   choosing a target, it cycles through valid targets in range.
 *   Auto Quick Target will start the cursor on the first valid
 *   selection. Auto Quick Actor starts the cursor on the next
 *   actor when you finish an action.
 *
 * Automatic changes:
 * - Cancelling out of targeting or movement moves the cursor
 *   back to the actor's position
 *
 */

/*:ja
 * @target MZ
 * @plugindesc SRPG用のカーソル、移動および選択を改善します（おひさまクラフトによる改変）。
 * @author Dr. Q
 *
 * @param Cursor-Style Movement
 * @desc カーソル移動をカーソル形式にします。
 * @type boolean
 * @default true
 * 
 * @param Cursor Delay
 * @desc カーソル移動のフレームディレイ
 * @parent Cursor-Style Movement
 * @type number
 * @default 8
 *
 * @param Cursor Speed
 * @desc カーソル移動速度。イベントの「移動速度」と同じ形式です。
 * @parent Cursor-Style Movement
 * @type number
 * @default 6
 *
 *
 * @param Animate Cursor
 * @desc カーソルが自動的にアニメーションするようになります。
 * @type boolean
 * @default true
 *
 * @param Animate Delay
 * @desc カーソルフレーム間のフレームディレイ
 * @parent Animate Cursor
 * @type number
 * @default 15
 *
 *
 * @param Start On Next Actor
 * @desc 行動完了後、自動的に次のアクターまでカーソルが移動します。
 * @type boolean
 * @default true
 *
 *
 * @param Switch Actor While Moving
 * @desc 移動している間、そのアクターを動かす代わりに別のアクターをカーソル選択します。
 * @type boolean
 * @default true
 *
 *
 * @param Quick Attack
 * @desc 移動している間、攻撃対象にするために敵をカーソル選択します。
 * Requires SRPG_RangeControl.js
 * @type boolean
 * @default true
 *
 *
 * @param Quick Target Switch
 * @desc ターゲット切り替えにPage Up / Page Downを使用します。
 * @type boolean
 * @default true
 * 
 * @param Quick Switch From Preview
 * @desc 戦闘予測画面にてターゲット切り替えを使用します。AoEやマップのマスを対象にするスキルには適用されません。
 * @parent Quick Target Switch
 * @type boolean
 * @default false
 *
 *
 * @param Auto Target
 * @desc カーソル初期位置が対象になりうるユニットになります（いれば）。
 * @type boolean
 * @default true
 *
 * @param Auto Select
 * @desc 最初の有効な対象を自動的に選択します（Auto Targetが有効である必要があります）。AoEやマップのマスを対象にするスキルには適用されません。
 * @parent Auto Target
 * @type select
 * @option 常にしない
 * @value 0
 * @option 自分対象のみする
 * @value 1
 * @option 常にする
 * @value 2
 * @default 0
 *
 *
 * @help
 * copyright 2020 SRPG Team. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 戦闘をより早くスムーズにするための改善
 * 
 * オプション:
 *
 * - Cursor-Style Movement: カーソルのマスからマスへの移動が素早く、
 *   SE付きになります。Cursor Delayにて移動後の停滞時間を制御できます。
 *   Cursor Speedは移動速度を決定します。
 *   これはSRPG_etcModのカーソル形式移動と競合する可能性があります。
 *
 * - Animate Cursor: マップ上のカーソルが、移動していなくてもアニメーション
 *   するようになります。Animate Delayはフレームごとの滞留時間を制御します。
 *
 * - Quick Target: アクターフェイズにて、page upやpage downを押下することで
 *   操作可能ユニットが切り替わるようになります。対象選択時は、射程内の有効な
 *   対象の切り替えが可能です。
 *   Auto Quick Targetは最初の有効な選択にカーソルが移動します。
 *   Auto Quick Actorは行動終了時、次のアクターにカーソルが移動します。
 *
 * 自動適用:
 * - 対象選択や移動をキャンセルすると、カーソルがアクターの位置に戻ります。
 *
 */

(function(){
	// parameters
	var parameters = PluginManager.parameters('SRPG_UX_Cursor_MZ');

	var cursorStyle = !!eval(parameters['Cursor-Style Movement']);
	var cursorDelay = Number(parameters['Cursor Delay']) || 10;
	var cursorSpeed = Number(parameters['Cursor Speed']) || 6;
	var animateCursor = !!eval(parameters['Animate Cursor']);
	var animateDelay = Number(parameters['Animate Delay']) || 15;

	var moveSwitch = !!eval(parameters['Switch Actor While Moving']);
	var autoActor = !!eval(parameters['Start On Next Actor']);

	var quickTarget = !!eval(parameters['Quick Target Switch']);
	var previewSwitch = !!eval(parameters['Quick Switch From Preview']);

	var quickAttack = !!eval(parameters['Quick Attack']);

	var autoTarget = !!eval(parameters['Auto Target']);
	var autoSelect = Number(parameters['Auto Select']);

//====================================================================
// cursor-style movement
//====================================================================

	// Override cursor speed
	var _realMoveSpeed = Game_Player.prototype.realMoveSpeed;
	Game_Player.prototype.realMoveSpeed = function() {
		if ($gameSystem.isSRPGMode() && cursorStyle) {
			return cursorSpeed;
		} else {
			return _realMoveSpeed.call(this);
		}
	};

	// don't bounce upward when using Jump to move the cursor around
	Game_Player.prototype.jumpHeight = function() {
		return $gameSystem.isSRPGMode() ? 0 : Game_CharacterBase.prototype.jumpHeight.call(this);
	};

	// move directly to the target location
	Game_Player.prototype.slideTo = function(x, y) {
		this.jump(x - this.x, y - this.y);
	};

	// override movement to act more like a cursor
	var _moveByInput = Game_Player.prototype.moveByInput;
	Game_Player.prototype.moveByInput = function() {
		if ($gameSystem.isSRPGMode() && cursorStyle && !this.isMoving()) {
			// automatic movement
			if ($gameTemp.isAutoMoveDestinationValid()) {
				var x = $gameTemp.autoMoveDestinationX();
				var y = $gameTemp.autoMoveDestinationY();
				this.slideTo(x, y);
				$gameTemp.setAutoMoveDestinationValid(false);
			}
			// manual movement
			else if (this.canMove()) {
				this._cursorDelay = this._cursorDelay || 0;
				this._cursorDelay--;

				// mouse control (WIP)
				if ($gameTemp.isDestinationValid()) {
					var x = $gameTemp.destinationX();
					var y = $gameTemp.destinationY();
					if ((this.posX() != x || this.posY() != y) &&
							x >= 0 && x < $gameMap.width() && y >= 0 && y < $gameMap.height()) {
						SoundManager.playCursor();
						this.slideTo(x, y);
						this.setMovementSuccess(true);
					}
				} else if (this._cursorDelay <= 0) { // key control
					var direction = this.getInputDirection();
					if (direction > 0 && this.canPass(this._x, this._y, direction)) {
						SoundManager.playCursor();
						$gameTemp.clearDestination();
						this.setDirection(direction);
						this.executeMove(direction);
						this._cursorDelay = cursorDelay;
					}
				}
				return;
			}
		}
		_moveByInput.call(this);
	};

//====================================================================
// cursor animates all the time
//====================================================================

	// cursor animates even while static
	_hasStepAnime = Game_Player.prototype.hasStepAnime;
	Game_Player.prototype.hasStepAnime = function() {
		if ($gameSystem.isSRPGMode() && animateCursor) return true;
		return _hasStepAnime.call(this);
	};

	// custom cursor animation rate
	_animationWait = Game_Player.prototype.animationWait;
	Game_Player.prototype.animationWait = function() {
		if ($gameSystem.isSRPGMode() && animateCursor) return animateDelay;
		return _animationWait.call(this);
	};

//====================================================================
// cursor automatically moves as needed
//====================================================================

	// cancel movement or target, plus quick targeting
	var _updateCallMenu = Scene_Map.prototype.updateCallMenu;
	Scene_Map.prototype.updateCallMenu = function() {
		if ($gameSystem.isSRPGMode() && !$gameSystem.srpgWaitMoving()) {
			// return cursor when deselecting
			if (($gameSystem.isSubBattlePhase() === 'actor_move' ||
				$gameSystem.isSubBattlePhase() === 'actor_target' ||
				$gameSystem.isSubBattlePhase() === 'actor_targetArea') &&
				this.isMenuCalled()) {
				var event = $gameTemp.activeEvent();
				$gamePlayer.slideTo(event.posX(), event.posY());
			}
			// page through valid selections
			if (Input.isTriggered('pagedown')) {
				if (moveSwitch && $gameSystem.isSubBattlePhase() === 'actor_move') {
					SoundManager.playCursor();
					$gameSystem.getNextRActor();
				}
				if (quickTarget && ($gameSystem.isSubBattlePhase() === 'actor_target' || $gameSystem.isSubBattlePhase() === 'actor_targetArea')) {
					SoundManager.playCursor();
					$gameSystem.getNextRTarget();
				}
			} else if (Input.isTriggered('pageup')) {
				if (moveSwitch && $gameSystem.isSubBattlePhase() === 'actor_move') {
					SoundManager.playCursor();
					$gameSystem.getNextLActor();
				}
				if (quickTarget && ($gameSystem.isSubBattlePhase() === 'actor_target' || $gameSystem.isSubBattlePhase() === 'actor_targetArea')) {
					SoundManager.playCursor();
					$gameSystem.getNextLTarget();
				}
			}
		}
		_updateCallMenu.call(this);
	};

	// If autoselect applies, cancelling the battle preview skips back to the command window
	var _selectPreviousSrpgBattleStart = Scene_Map.prototype.selectPreviousSrpgBattleStart;
	Scene_Map.prototype.selectPreviousSrpgBattleStart = function() {
		_selectPreviousSrpgBattleStart.call(this);
		if ($gameTemp.canAutoSelect()) {
			var event = $gameTemp.activeEvent();
			var battlerArray = $gameSystem.EventToUnit(event.eventId());

			$gameTemp.clearMoveTable();
			$gameTemp.initialMoveTable($gameTemp.originalPos()[0], $gameTemp.originalPos()[1], battlerArray[1].srpgMove());
			event.makeMoveTable($gameTemp.originalPos()[0], $gameTemp.originalPos()[1], battlerArray[1].srpgMove(), [0], battlerArray[1].srpgThroughTag());
			var list = $gameTemp.moveList();
			for (var i = 0; i < list.length; i++) {
				var pos = list[i];
				event.makeRangeTable(pos[0], pos[1], battlerArray[1].srpgWeaponRange(), [0], pos[0], pos[1], $dataSkills[battlerArray[1].attackSkillId()]);
			}
			$gameTemp.pushRangeListToMoveList();
			$gameTemp.setResetMoveList(true);

			$gamePlayer.slideTo(event.posX(), event.posY());
			$gameSystem.setSrpgActorCommandWindowNeedRefresh(battlerArray);
			$gameSystem.setSubBattlePhase('actor_command_window');
		}
	};

//====================================================================
// cycle through valid selections
//====================================================================

	// (utility function) checks if an event is an actor the player can control
	Game_System.prototype.eventIsUsableActor = function(event) {
		if (!event) return false;
		var actorArray = this.EventToUnit(event.eventId());
		return (actorArray && actorArray[0] === 'actor' && actorArray[1].canInput());
	};

	// (utility function) checks if an event is within the current skill's range
	// SRPG_AoEの定義に統合
	/*
	Game_System.prototype.positionInRange = function(x, y) {
		var range = $gameTemp.rangeList();
		for (var i = 0; i < range.length; i++) {
			if (range[i][0] == x && range[i][1] == y) return true;
		}
		return false;
	};
	*/

	// (utility function) checks if an event is a valid target for the current skill
	Game_System.prototype.eventIsValidTarget = function(event) {
		if (!event || event.isErased()) return false;
		var unitArray = this.EventToUnit(event.eventId());
		if (!unitArray) return false;
		var action = this.EventToUnit($gameTemp.activeEvent().eventId())[1].currentAction();
		if (!action || !action.item()) return false;

		if (((unitArray[0] === 'enemy' && action.isForOpponent()) ||
			(unitArray[0] === 'actor' && action.isForFriend()))) {
			return true;
		}
	};

	// find the next valid target
	Game_System.prototype.getNextRTarget = function() {
		var id = 0;
		var events = $gameMap.eventsXyNt($gamePlayer.x, $gamePlayer.y);
		if (events && events.length > 0) {
			id = events[0].eventId();
		}
		var newId = $gameSystem.findSelection("target", id);
		return (id != newId);
	};

	// find the previous valid target
	Game_System.prototype.getNextLTarget = function() {
		var id = 0;
		var events = $gameMap.eventsXyNt($gamePlayer.x, $gamePlayer.y);
		if (events && events.length > 0) {
			id = events[0].eventId();
		}
		var newId = $gameSystem.findSelection("target", id, true);
		return (id != newId);
	};

	// override the actor selecting functions with a different formula
	Game_System.prototype.getNextRActor = function() {
		var id = 0;
		var events = $gameMap.eventsXyNt($gamePlayer.x, $gamePlayer.y);
		if (events && events.length > 0) {
			id = events[0].eventId();
		}
		var newId = $gameSystem.findSelection("actor", id);
		return (id != newId);
	};
	Game_System.prototype.getNextLActor = function() {
		var id = 0;
		var events = $gameMap.eventsXyNt($gamePlayer.x, $gamePlayer.y);
		if (events && events.length > 0) {
			id = events[0].eventId();
		}
		var newId = $gameSystem.findSelection("actor", id, true);
		return (id != newId);
	};

	// change selected actor during the movement phase
	Game_System.prototype.changeMovingActor = function(id) {
		// update the movement and activity
		var event = $gameMap.event(id);
		$gameTemp.setActiveEvent(event);
		$gameTemp.reserveOriginalPos(event.posX(), event.posY());
		$gameSystem.srpgMakeMoveTable(event);
		$gameTemp.setResetMoveList(true);

		// update the window
		var battlerArray = $gameSystem.EventToUnit(id);
		$gameParty.clearSrpgBattleActors();
		SceneManager._scene._mapSrpgActorCommandStatusWindow.clearBattler();
		$gameParty.pushSrpgBattleActors(battlerArray[1]);
		$gameSystem.setSrpgActorCommandStatusWindowNeedRefresh(battlerArray);
		SceneManager._scene._mapSrpgActorCommandStatusWindow.setBattler(battlerArray[1]);
	};

	// jump ahead to attack, targeting a specific space
	Game_System.prototype.quickAttack = function(x, y) {
		if ($gameTemp.RangeMoveTable && $gameTemp.RangeMoveTable(x, y).length > 0) {
			var event = $gameTemp.activeEvent();
			var unitAry = $gameSystem.EventToUnit(event.eventId());
			if (event && unitAry && unitAry[1]) {
				// move to position
				var pos = $gameTemp.RangeMoveTable(x, y)[0];
				if (!pos) return false;
				var route = $gameTemp.MoveTable(pos.x, pos.y)[1];
				event.srpgMoveRouteForce(route);
				$gameSystem.setSrpgWaitMoving(true);
				// ready the attack
				unitAry[1].srpgMakeNewActions();
				unitAry[1].action(0).setAttack();
				var item = $dataSkills[unitAry[1].attackSkillId()];
				// jump to the attack command
				$gameTemp.clearMoveTable();
				event.makeRangeTable(pos.x, pos.y, unitAry[1].srpgSkillRange(item), [0], pos.x, pos.y, item);
				$gameTemp.pushRangeListToMoveList();
				$gameTemp.setResetMoveList(true);
				$gameSystem.setSubBattlePhase('actor_target');
				$gamePlayer.startMapEvent(x, y, [1]);
				return true;
			}
		}
		return false;
	};

	// add next/previous target commands to the attack preview
	var _createSrpgBattleWindow = Scene_Map.prototype.createSrpgBattleWindow;
	Scene_Map.prototype.createSrpgBattleWindow = function() {
		_createSrpgBattleWindow.call(this);
		if (previewSwitch) {
			this._mapSrpgBattleWindow.setHandler('pageup', this.switchMenuTarget.bind(this, false));
			this._mapSrpgBattleWindow.setHandler('pagedown', this.switchMenuTarget.bind(this, true));
		}
	};

	// find next/previous target and activate it in the menu
	Scene_Map.prototype.switchMenuTarget = function(reverse) {
		var current = $gameTemp.targetEvent().eventId();
		var next = current;
		if (!$gameTemp.isSelfOnly() && !$gameTemp.isCellTarget()) {
			next = $gameSystem.findSelection("target", current, reverse);
			SoundManager.playCursor();
		}
		this.updateMenuSelection(next);
	};

	// update the target of the battle window
	Scene_Map.prototype.updateMenuSelection = function(id) {
		var event = $gameMap.event(id);
		var user = $gameTemp.activeEvent();
		var targetBattlerArray = $gameSystem.EventToUnit(id);
		var actionBattlerArray = $gameSystem.EventToUnit(user.eventId());
		var item = actionBattlerArray[1].currentAction().item();

		this._mapSrpgTargetWindow.clearBattler();
		this._mapSrpgPredictionWindow.clearBattler();
		this._mapSrpgBattleWindow.clearActor();

		$gameSystem.setSrpgStatusWindowNeedRefresh(actionBattlerArray);
		$gameSystem.setSrpgBattleWindowNeedRefresh(actionBattlerArray, targetBattlerArray);

		$gameTemp.setSrpgDistance($gameSystem.unitDistance(user, event));
		$gameTemp.setSrpgSpecialRange(user.srpgRangeExtention(event.posX(), event.posY(), user.posX(), user.posY(), item));
		$gameTemp.setTargetEvent(event);

		this._mapSrpgTargetWindow.setBattler(targetBattlerArray);
		this._mapSrpgPredictionWindow.setBattler(actionBattlerArray, targetBattlerArray);
		this._mapSrpgBattleWindow.setup(actionBattlerArray);
	};

	// automatically highlight the first target when you start targeting
	var _UXCursor_startActorTargetting = Scene_Map.prototype.startActorTargetting;
	Scene_Map.prototype.startActorTargetting = function() {
		_UXCursor_startActorTargetting.call(this);
		const battler = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		const action = battler.currentAction();
		if (autoTarget && !action.isForDeadFriend()) {
			var id = $gameSystem.findSelection("target");
			if ($gameTemp.canAutoSelect()) {
				var event = $gameMap.event(id);
				if (event) $gamePlayer.startMapEvent(event.posX(), event.posY(), "0", false);
			}
		}
	};

	var _triggerAction = Game_Player.prototype.triggerAction;
	Game_Player.prototype.triggerAction = function() {
		// manually switch actors during the movement phase
		if (moveSwitch && $gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_move' &&
		(Input.isTriggered('ok') || TouchInput.isTriggered())) {
			var newId = 0;
			$gameMap.events().forEach(function (event) {
				if (!event.isErased() && event.pos($gamePlayer.posX(), $gamePlayer.posY()) &&
				event.isType() === 'actor' && $gameSystem.EventToUnit(event.eventId())[1].canInput()) {
						newId = event.eventId();
				}
			});
			if (newId > 0 && newId !== $gameTemp.activeEvent().eventId()) {
				SoundManager.playOk();
				$gameSystem.changeMovingActor(newId);
				return;
			}
		}
		// quickly line up an attack on an enemy during movement
		if (quickAttack && $gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_move' &&
		(Input.isTriggered('ok') || TouchInput.isTriggered())) {
			var validTarget = $gameMap.events().some(function (event){
				return (!event.isErased() && event.pos($gamePlayer.posX(), $gamePlayer.posY()) &&
				event.isType() == 'enemy');
			});
			if (validTarget && $gameSystem.quickAttack($gamePlayer.posX(), $gamePlayer.posY())) {
				return;
			}
		}
		_triggerAction.call(this);
	}

	// after completing an action, move the cursor to the next actor
	var _srpgAfterAction = Scene_Map.prototype.srpgAfterAction;
	Scene_Map.prototype.srpgAfterAction = function() {
		_srpgAfterAction.call(this);
		if (autoActor && $gameSystem.isBattlePhase() === 'actor_phase' &&
		$gameSystem.isSubBattlePhase() === 'normal') {
			$gameSystem.getNextRActor();
		}
	};

	// check if the current skill is self target or not
	Game_Temp.prototype.isSelfOnly = function() {
		var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		if (!actor) return false;
		var action = actor.currentAction();
		if (!action || !action.isForFriend()) return false;
		var skill = action.item();
		if (!skill) return false;
		if (skill.meta.srpgVariableRange) return false; // variable range = not self target
		return !!(actor.srpgSkillRange(skill) < 1);
	};

	// check if it can target an empty cell or not
	Game_Temp.prototype.isCellTarget = function() {
		if (!Game_Battler.prototype.srpgSkillAreaRange) return false;

		var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		if (!actor) return false;
		var skill = actor.currentAction().item();
		if (!skill) return false;
		if (skill.meta.cellTarget) return true;
		return !!(actor.srpgSkillAreaRange(skill) > 0);
	};

	// check if the current skill can auto-select
	Game_Temp.prototype.canAutoSelect = function() {
		if (!autoTarget) return false;
		if (autoSelect < 1) return false;
		if (autoSelect < 2 && !$gameTemp.isSelfOnly()) return false;
		if ($gameTemp.isCellTarget()) return false;
		return true;
	};

	// find a selectable event for the context (returns the event ID)
	Game_System.prototype.findSelection = function(type, start, reverse) {
		var max = $gameMap.isMaxEventId()+1;
		var step = reverse ? max-1 : 1;
		start = (+start) || 0;

		for (var id = (start+step)%max; id != start; id = (id+step)%max) {
			if (id == 0) continue;
			var event = $gameMap.event(id);
			if (!event) continue;
			if ((type === "actor" && $gameSystem.eventIsUsableActor(event)) ||
			(type === "target" && $gameSystem.eventIsValidTarget(event) && $gameSystem.positionInRange(event.posX(), event.posY()))) {
				$gameTemp.setAutoMoveDestinationValid(true);
				$gameTemp.setAutoMoveDestination(event.posX(), event.posY());
				return id;
			}
		}
		return start; // couldn't find a new target
	};

})();
