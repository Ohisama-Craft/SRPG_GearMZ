//-----------------------------------------------------------------------------
// SRPG_AoE_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPG area-of-effect skills, edited by OhisamaCraft.
 * @author Dr. Q + アンチョビ
 * 
 * @param AoE Color
 * @desc CSS Color for AoE squares
 * https://www.w3schools.com/cssref/css_colors.asp
 * @type string
 * @default DarkOrange
 *
 * @param Show One Square AoE
 * @desc Show AoE indicator for single target effects?
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 *
 * @param Refocus Camera
 * @desc Move the camera to each target as it's hit
 * @type boolean
 * @on Move
 * @off Don't move
 * @default false
 *
 * @noteParam faceName
 * @noteDir img/faces/
 * @noteType file
 * @noteData enemies
 *
 * @help
 * copyright 2020 SRPG Team. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * Allows you to define an area of effect for attacks
 * Based on SRPG_AreaAttack.js by アンチョビ
 *
 * Note: SRPG_AreaAttack and SRPG_AoE define many of the same features in
 * different ways, and are incompatible if you try to use both.
 * 
 * When using an AoE skill, you can target an empty cell as long as there is at
 * least one valid target within the area
 * AI units won't make use of this, and will always try to target a unit
 * directly, catching other targets by coincidence
 * 
 * By default, AI units are not allowed to use AoE effects with a minimum range
 * of 1 or more because they don't understand how to aim them, but other
 * plugins that improve the AI can include the following line to reenable them:
 * Game_System.prototype.srpgAIUnderstandsAoE = true;
 * 
 * Note: .SRPGActionTimesAdd(X) will only work during the first target of a
 * skill if it has an AoE. If you want to modify action times manually, use
 * ._SRPGActionTimes += X instead.
 * 
 * AoE is ignored in the counter action (action by the defender). only fights against the attacker.
 * 
 * Skill / item notetags:
 * <srpgAreaRange:x>    creates an AoE of size x
 * <srpgAreaMinRange:x> adjusts the minimum AoE size, creating a hole
 * <srpgAreaTargets:x>  set the maximum number of targets the skill can hit
 * <srpgAreaType:y>     changes the shape of the AoE
 *   type defaults to 'circle' if not specified
 *
 * <srpgAreaOrder:near> select targets from nearest to furthest (default)
 * <srpgAreaOrder:far>  select targets from furthest to nearets
 * <srpgAreaOrder:random> select targets randomly within the AoE
 *
 *
 * The following shapes are available, shown at a size of 2, min size of 0
 * The number shows what distance it is at
 *
 * circle: hits a circle around the target cell
 *      2
 *    2 1 2
 *  2 1 0 1 2
 *    2 1 2
 *      2
 *
 * square - hits a square around the target cell
 *  2 2 2 2 2
 *  2 1 1 1 2
 *  2 1 0 1 2
 *  2 1 1 1 2
 *  2 2 2 2 2
 *
 * line - hits a straight line behind of the target cell
 *
 *      0
 *      1
 *      2
 * (facing down)
 *
 * cone - hits a 90 degree cone behind the target cell
 *
 *
 *      0
 *    1 1 1
 *  2 2 2 2 2
 * (facing down)
 *
 * split - hits a v shape behind the target cell
 *
 *
 *      0
 *    1   1
 *  2       2
 * (facing down)
 *
 * arc - hits a v shape coming back from the target cell
 *  2       2
 *    1   1
 *      0
 *
 *
 * (facing down)
 *
 * side - hits a line to either side of the target cell
 *
 *
 *  2 1 0 1 2
 *
 *
 * (facing down)
 *
 * tee - hits behind and to the sides of the target
 *
 *
 *  2 1 0 1 2
 *      1
 *      2
 * (facing down)
 *
 * plus - hits a + shape around the target cell
 *      2
 *      1
 *  2 1 0 1 2
 *      1
 *      2
 *
 * cross - hits an x shape around the target cell
 *  2       2
 *    1   1
 *      0
 *    1   1
 *  2       2
 *
 * star - hits a + and an x shape around the target cell
 *  2   2   2
 *    1 1 1
 *  2 1 0 1 2
 *    1 1 1
 *  2   2   2
 *
 * checker - hits every other cell in a square
 *  2   2   2
 *    1   1
 *  2   0   2
 *    1   1
 *  2   2   2
 *
 * Script calls for advanced users:
 *  yourEvent.battlersNear(size, minSize, 'shape', [direction])
 *  yourEvent.enemiesNear(size, minSize, 'shape', [direction])
 *  yourEvent.actorsNear(size, minSize, 'shape', [direction])
 *
 * Returns a list of actors/enemies/both near the specified event, supporting
 * the same AoE shapes listed above. If you use a directional AoE shape and no
 * direction is specified, it will point where your event is facing
 * 
 * Note / Modification by Ohisama Craft
 * -Corrected cost consumption (changed from gameTemp to gameBattler to counter action)
 * -Added allActor / allEnemy to AoE shape (targets all actors / enemies within range)
 * -Supports Game_Player.prototype.triggerAction for SRPGgearMV
 * -Japanese translation of help
 * 
 */


/*:ja
 * @target MZ
 * @plugindesc SRPG戦闘で範囲攻撃（スキル）を実装します(SRPG_gearMV用)
 * @author Dr. Q + アンチョビ, おひさまクラフト
 * 
 * @param AoE Color
 * @desc 範囲表示のための CSS Color を設定します
 * https://www.w3schools.com/cssref/css_colors.asp
 * @type string
 * @default DarkOrange
 *
 * @param Show One Square AoE
 * @desc 単体（１マス）が対象の時も AoE の範囲表示を行うか
 * @type boolean
 * @on Show
 * @off Hide
 * @default false
 *
 * @param Refocus Camera
 * @desc 効果が発動するとき、個々の対象が画面の中央になるように画面移動するか
 * @type boolean
 * @on Move
 * @off Don't move
 * @default false
 * 
 * @noteParam faceName
 * @noteDir img/faces/
 * @noteType file
 * @noteData enemies
 * 
 * @help
 * copyright 2020 SRPG Team. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 範囲効果のあるスキル・アイテムを作成できるようにします
 * アンチョビ氏による SRPG_AreaAttack.js をベースにしています
 *
 * 注：SRPG_AreaAttackとSRPG_AoEは、同じ機能の多くをさまざまな方法で定義しており、
 * 両方を同時に使用しようとすることはできません。
 * 
 * AoEスキルを使用する場合、エリア内に少なくとも1つの有効なターゲットがある限り、
 * 空のセルをターゲットにすることができます。
 * AIユニット（自動行動アクターやエネミー）はこれを利用せず、常にユニットを直接ターゲットにしようとし、
 * 偶然に他のターゲットを範囲内に巻き込みます（SRPG_AIControlを併用しない場合）。
 * 
 * デフォルトでは、AIユニットは、照準を合わせる方法がわからないため、
 * 最小範囲が1以上のAoEエフェクトを使用しません。
 * AIを改善する他のプラグインを作成する場合、次の行を用いることで有効にすることができます：
 * Game_System.prototype.srpgAIUnderstandsAoE = true;
 * 
 * 注：.SRPGActionTimesAdd(X) は、AoEスキルの最初のターゲットにのみ機能します。 
 * 行動回数を実際にターゲットに使用した回数だけ繰り返して増やしたい場合は、
 * 代わりに._SRPGActionTimes +=X を使用してください。
 * 
 * 応戦（防御側による行動）では AoE が無視されます（攻撃者に対してのみ応戦します）。
 * 
 * スキル / アイテムのメモ:
 * <srpgAreaRange:x>    : サイズxのAoEを作成します（下記も参照）
 * <srpgAreaMinRange:x> : 最小AoEサイズを設定します。範囲の真ん中に穴を作成します。
 * <srpgAreaTargets:x>  : スキルが発動するターゲットの最大数を設定します。
 * <srpgAreaType:y>     : AoEの形状を変更します。
 *                        特に指定しない場合、'circle'に設定されます。
 *
 * <srpgAreaOrder:near>   :AoEの中心に近い側のターゲットから行動を実行します（デフォルト）。
 * <srpgAreaOrder:far>    :AoEの中心から遠い側のターゲットから行動を実行します。
 * <srpgAreaOrder:random> :AoEの中のターゲットにランダムな順番で行動を実行します。
 *
 * <srpgAreaType:y>では、次の形状が設定できます。
 * 0 がカーソルの位置、数字はそこからの距離になります（<srpgAreaRange:x>で設定）。
 * 下記は、<srpgAreaRange:2>で例示しています。
 *
 * circle: ターゲットセルを中心に円形
 *      2
 *    2 1 2
 *  2 1 0 1 2
 *    2 1 2
 *      2
 *
 * square - ターゲットセルを中心に四角形
 *  2 2 2 2 2
 *  2 1 1 1 2
 *  2 1 0 1 2
 *  2 1 1 1 2
 *  2 2 2 2 2
 *
 * line - ターゲットセルから直線（例は使用者が下向きの場合）
 *
 *      0
 *      1
 *      2
 *   (下向き)
 *
 * cone - ターゲットセルから扇状（例は使用者が下向きの場合）
 *
 *
 *      0
 *    1 1 1
 *  2 2 2 2 2
 *   (下向き)
 *
 * split - ターゲットセルからV字（例は使用者が下向きの場合）
 *
 *
 *      0
 *    1   1
 *  2       2
 *   (下向き)
 *
 * arc - ターゲットセルから円弧上（例は使用者が下向きの場合）
 *  2       2
 *    1   1
 *      0
 *
 *
 *   (下向き)
 *
 * side - ターゲットセルから横一列
 *
 *
 *  2 1 0 1 2
 *
 *
 *   (下向き)
 *
 * tee - ターゲットセルから下＋横一列（T字）
 *
 *
 *  2 1 0 1 2
 *      1
 *      2
 *   (下向き)
 *
 * plus - ターゲットセルから十字（＋型）
 *      2
 *      1
 *  2 1 0 1 2
 *      1
 *      2
 *
 * cross - ターゲットセルから斜め（X型）
 *  2       2
 *    1   1
 *      0
 *    1   1
 *  2       2
 *
 * star - ターゲットセルから十字＋斜め（星型）
 *  2   2   2
 *    1 1 1
 *  2 1 0 1 2
 *    1 1 1
 *  2   2   2
 *
 * checker - ターゲットセルを中心に格子状
 *  2   2   2
 *    1   1
 *  2   0   2
 *    1   1
 *  2   2   2
 * 
 * allActor - 射程範囲内のすべてのアクター
 * <srpgAreaRange:x> は 1 以上に設定してください。
 * 
 * allEnemy - 射程範囲内のすべてのエネミー
 * <srpgAreaRange:x> は 1 以上に設定してください。
 * 
 *
 * 慣れた人向け　スクリプトで使用できるコマンド:
 *  yourEvent.battlersNear(size, minSize, 'shape', [direction])
 *  yourEvent.enemiesNear(size, minSize, 'shape', [direction])
 *  yourEvent.actorsNear(size, minSize, 'shape', [direction])
 *
 * 指定したイベントを中心としたAoEの範囲内にいるアクター/エネミー/両方のリストを返します。
 * 指向性のあるAoEを使用し、directionが指定されていない場合、イベントの向きをdirectionとします。
 * 
 * 注 / おひさまクラフトによる改変内容 ('modified by OhisamaCraft'で検索)
 * ・コスト消費の修正（応戦に対応するためgameTempからgameBattlerに変更）
 * ・<srpgAreaType:y> (AoE shape) に allActor, allEnemy を追加（射程範囲内のすべてのactor/enemyを対象とする）
 * ・Game_Player.prototype.triggerActionをSRPGgearMZに対応
 * ・ヘルプの和訳
 * 
 */

//====================================================================
// ●Function Declaration
//====================================================================
function Sprite_SrpgAoE() {
    this.initialize(...arguments);
}

Sprite_SrpgAoE.prototype = Object.create(Sprite.prototype);
Sprite_SrpgAoE.prototype.constructor = Sprite_SrpgAoE;

//====================================================================
// ●Plugin
//====================================================================
(function(){

	var parameters = PluginManager.parameters('SRPG_AoE_MZ');
	var _oneSquare = !!eval(parameters['Show One Square AoE']);
	var _areaColor = parameters['AoE Color'];
	var _refocus = !!eval(parameters['Refocus Camera']);

	var coreParameters = PluginManager.parameters('SRPG_core_MZ');
	var _srpgPredictionWindowMode = Number(coreParameters['srpgPredictionWindowMode'] || 1);

//====================================================================
// Compatibility with plugins expecting SRPG_AreaAttack.js
//====================================================================

	// modified by OhisamaCraft
	Game_Temp.prototype.isFirstAction = function(battler) {
		return !!(battler.shouldPayCost());
	};
	Game_Temp.prototype.isLastAction = function() {
		return !!(this.areaTargets().length < 1);
	};
	Game_BattlerBase.prototype.srpgSkillAreaRange = function(item) {
		return Number(item.meta.srpgAreaRange);
	};

//====================================================================
// Get AoE data for the skill
//====================================================================

	// get AoE properties
	Game_Action.prototype.area = function() {
		if (this.item()) return Number(this.item().meta.srpgAreaRange) || 0;
		return 0;
	};
	Game_Action.prototype.minArea = function() {
		if (this.item()) return Number(this.item().meta.srpgAreaMinRange) || 0;
		return 0;
	};
	Game_Action.prototype.areaType = function() {
		var type = '';
		if (this.item()) type = this.item().meta.srpgAreaType || '';
		type = type.toLowerCase();
		return type;
	};
	Game_Action.prototype.areaTargetLimit = function() {
		if (this.item()) return Number(this.item().meta.srpgAreaTargets) || 0;
		return 0;
	};
	Game_Action.prototype.areaOrder = function() {
		var order = '';
		if (this.item()) return this.item().meta.srpgAreaOrder || '';
		order = order.toLowerCase();
		return order;
	};

	// (utility) find the direction to a fixed point, discounting obstacles
	Game_Character.prototype.dirTo = function(x, y) {
		var dir = 5;
		var dx = this.posX() - x;
		var dy = this.posY() - y;

		// account for looping maps
		if ($gameMap.isLoopHorizontal()) {
			if (dx > $gameMap.width() / 2) dx -= $gameMap.width();
			if (dx < -$gameMap.width() / 2) dx += $gameMap.width();
		}
		if ($gameMap.isLoopVertical()) {
			if (dy > $gameMap.height() / 2) dy -= $gameMap.height();
			if (dy < -$gameMap.height() / 2) dy += $gameMap.height();
		}

		if (Math.abs(dx) > Math.abs(dy)) {
			dir = dx > 0 ? 4 : 6;
		} else if (dy !== 0) {
			dir = dy > 0 ? 8 : 2;
		}
		return dir;
	};

	// (utility) find the distance to a fixed point, discounting obstacles
	Game_Character.prototype.distTo = function(x, y) {
		var dx = Math.abs(this.posX() - x);
		var dy = Math.abs(this.posY() - y);

		if ($gameMap.isLoopHorizontal()) dx = Math.min(dx, $gameMap.width() - dx);
		if ($gameMap.isLoopVertical()) dy = Math.min(dy, $gameMap.height() - dy);
		
		return  dx + dy;
	};

	// (utility) checks if a position is within the current skill's range
	Game_System.prototype.positionInRange = function(x, y) {
		var range = $gameTemp.moveList();
		for (var i = 0; i < range.length; i++) {
			if (range[i][0] == x && range[i][1] == y) return true;
		}
		return false;
	};

//====================================================================
// Game_Temp (store lists of multiple targets)
//====================================================================

	var _Game_Temp_initialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function() {
		_Game_Temp_initialize.call(this);
		this._activeAoE = null;
		this._areaTargets = [];
		//this._shouldPaySkillCost = true;
	};

	// easy access to the origin of the AoE
	Game_Temp.prototype.areaX = function() {
		return this._activeAoE ? this._activeAoE.x : -1;
	};
	Game_Temp.prototype.areaY = function() {
		return this._activeAoE ? this._activeAoE.y : -1;
	};

	// check if an event is in the area of the current skill
	// modified by OhisamaCraft
	Game_Temp.prototype.inArea = function(event) {
		if (!this._activeAoE || this._activeAoE.size <= 0) return false;

		// all tiles in skill range
		if ((event.isType() === 'actor' && this._activeAoE.shape === 'allactor') ||
			(event.isType() === 'enemy' && this._activeAoE.shape === 'allenemy')) {
			for (var i = 0; i < $gameTemp.rangeList().length; i++) {
				var xy = $gameTemp.rangeList()[i];
				if (xy[0] === event.posX() && xy[1] === event.posY()) return true;
			}
			return false;
		}

		// default AoE
		var dx = event.posX() - this._activeAoE.x;
		var dy = event.posY() - this._activeAoE.y;

		if ($gameMap.isLoopHorizontal()) {
			if (dx > $gameMap.width() / 2) dx -= $gameMap.width();
			if (dx < -$gameMap.width() / 2) dx += $gameMap.width();
		}
		if ($gameMap.isLoopVertical()) {
			if (dy > $gameMap.height() / 2) dy -= $gameMap.height();
			if (dy < -$gameMap.height() / 2) dy += $gameMap.height();
		}

		return $gameMap.inArea(dx, dy, this._activeAoE.size, this._activeAoE.minSize, this._activeAoE.shape, this._activeAoE.dir);
	};

	// to attack multiple targets, you queue up a target list
	Game_Temp.prototype.clearAreaTargets = function() {
		this._areaTargets = [];
	};
	Game_Temp.prototype.addAreaTarget = function(action) {
		this._areaTargets.push(action);
	};
	Game_Temp.prototype.areaTargets = function() {
		return this._areaTargets;
	};

	// when repeating actions, the cost/item is only paid once
	// modified by OhisamaCraft
	/*
	Game_Temp.prototype.setShouldPayCost = function(flag) {
		this._shouldPaySkillCost = flag;
	};
	Game_Temp.prototype.shouldPayCost = function() {
		return this._shouldPaySkillCost;
	};
	*/
	Game_Battler.prototype.setShouldPayCost = function(flag) {
		this._shouldPaySkillCost = flag;
	};
	Game_Battler.prototype.shouldPayCost = function() {
		return this._shouldPaySkillCost;
	};
	var _useItem = Game_Battler.prototype.useItem;
	Game_Battler.prototype.useItem = function(skill) {
		if (!$gameSystem.isSRPGMode() || this.shouldPayCost()) {
			_useItem.call(this, skill);
		}
	};
	var _actionTimesAdd = Game_Battler.prototype.SRPGActionTimesAdd;
	Game_Battler.prototype.SRPGActionTimesAdd = function(num) {
		if (this.shouldPayCost()) {
			_actionTimesAdd.call(this, num);
		}
	};

//====================================================================
// Check what's in an area
//====================================================================

	// get a list of battlers near another battler
	Game_Character.prototype.battlersNear = function(size, minSize, shape, dir, type) {
		var x = this.posX();
		var y = this.posY();
		dir = dir || this.direction();

		var battlers = [];
		$gameMap.events().forEach(function (event) {
			if (event.isErased() || !event.inArea(x, y, size, minSize, shape, dir)) return;
			var unitAry = $gameSystem.EventToUnit(enemyEvent.eventId());
			if (unitAry && (unitAry[0] === type || type === null)) battlers.push(unitAry[1]);
		});
		return battlers;
	};
	Game_Character.prototype.enemiesNear = function(size, minSize, shape, dir) {
		return this.battlersNear(size, minSize, shape, dir, 'enemy');
	};
	Game_Character.prototype.actorsNear = function(size, minSize, shape, dir) {
		return this.battlersNear(size, minSize, shape, dir, 'actor');
	};

	// check if a character is within a specified AoE
	// modified by OhisamaCraft
	Game_Character.prototype.inArea = function(x, y, size, minSize, shape, dir) {
		if (size <= 0) return false; // one-square AoEs don't count as AoEs

		// all tiles in skill range
		if ((this.isType() === 'actor' && shape === 'allactor') ||
			(this.isType() === 'enemy' && shape === 'allenemy')) {
			for (var i = 0; i < $gameTemp.rangeList().length; i++) {
				var xy = $gameTemp.rangeList()[i];
				if (xy[0] === this.posX() && xy[1] === this.posY()) return true;
			}
			return false;
		}

		// default AoE
		var dx = this.posX() - x;
		var dy = this.posY() - y;

		// account for looping maps
		if ($gameMap.isLoopHorizontal()) {
			if (dx > $gameMap.width() / 2) dx -= $gameMap.width();
			if (dx < -$gameMap.width() / 2) dx += $gameMap.width();
		}
		if ($gameMap.isLoopVertical()) {
			if (dy > $gameMap.height() / 2) dy -= $gameMap.height();
			if (dy < -$gameMap.height() / 2) dy += $gameMap.height();
		}
		return $gameMap.inArea(dx, dy, size, minSize, shape, dir);
	};

	// check if a given position is within an area
	Game_Map.prototype.inArea = function(x, y, size, minSize, shape, dir) {
		var _fx = [0, -1, 0, 1, -1, 0, 1, -1, 0, 1][dir];
		var _fy = [0, 1, 1, 1, 0, 0, 0, -1, -1, -1][dir];

		var ry = x*_fx + y*_fy; // forward
		var rx = x*_fy - y*_fx; // sideways

		// apply default shape
		shape = shape || 'circle';

		// outside drawing boundary, doesn't count
		if (x > size || x < -size || y > size || y < -size) return false;

		switch (shape) {
			case 'line':
				if (rx != 0) return false;
				if (ry > size || ry < minSize) return false;
				return true;

			case 'cone':
				if (ry > size || ry < minSize) return false;
				if (Math.abs(rx) > Math.abs(ry)) return false;
				return true;

			case 'split':
				if (ry > size || ry < minSize) return false;
				if (Math.abs(rx) != Math.abs(ry)) return false;
				return true;

			case 'arc':
				if (ry < -size || ry > -minSize) return false;
				if (Math.abs(rx) != Math.abs(ry)) return false;
				return true;

			case 'side':
				if (ry != 0) return false;
				if (Math.abs(rx) > size || Math.abs(rx) < minSize) return false;
				return true;

			case 'tee':
				if (ry < 0) return false;
				if (x != 0 && y != 0) return false;
				if (Math.abs(x) > size || Math.abs(y) > size) return false;
				if (Math.abs(x) < minSize && Math.abs(y) < minSize) return false;
				return true;

			case 'plus':
				if (x != 0 && y != 0) return false;
				if (Math.abs(x) > size || Math.abs(y) > size) return false;
				if (Math.abs(x) < minSize && Math.abs(y) < minSize) return false;
				return true;

			case 'cross':
				if (Math.abs(x) != Math.abs(y)) return false;
				if (Math.abs(x) > size || Math.abs(x) < minSize) return false;
				return true;

			case 'star':
				if (Math.abs(x) != Math.abs(y) && x != 0 && y != 0) return false;
				if (Math.abs(x) > size || Math.abs(y) > size) return false
				if (Math.abs(x) < minSize && Math.abs(y) < minSize) return false
				return true;

			case 'checker':
				if ((x + y) % 2 != 0) return false;
				if (Math.abs(x) > size || Math.abs(y) > size) return false
				if (Math.abs(x) < minSize && Math.abs(y) < minSize) return false
				return true;

			case 'square':
				if (Math.abs(x) > size || Math.abs(y) > size) return false;
				if (Math.abs(x) < minSize && Math.abs(y) < minSize) return false
				return true;

			case 'circle':
				if (Math.abs(x) + Math.abs(y) > size || Math.abs(x) + Math.abs(y) < minSize) return false;
				return true;

			default: // support extension from other plugins
				return this.extraAreas(shape, x, y, rx, ry, size, minSize);
		}
	};

	// plugins can override this to add more shapes
	Game_Map.prototype.extraAreas = function(shape, x, y, rx, ry, size, minSize) {
		return false;
	};

//====================================================================
// Using AoE skills
//====================================================================

	// update the active AoE when you move the cursor
	var _startMapEvent = Game_Player.prototype.startMapEvent;
	Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
		if ($gameSystem.isSRPGMode() && triggers.contains(1)) {
			if ($gameSystem.isSubBattlePhase() === 'actor_target' && $gameSystem.positionInRange(x, y)) {
				$gameTemp.showArea(x, y);
			} else if ($gameSystem.isSubBattlePhase() !== 'invoke_action' &&
					   $gameSystem.isSubBattlePhase() !== 'battle_window' && $gameSystem.isBattlePhase() == 'actor_phase') { //shoukang add && $gameSystem.isBattlePhase() == 'actor_phase'
				$gameTemp.clearArea();
			}
		}
		if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_target' && $gameTemp.isSkillAoE()) {
			return;
		}
		_startMapEvent.call(this, x, y, triggers, normal);
	};

	// show the AoE when you start targeting
	var _startActorTargetting = Scene_Map.prototype.startActorTargetting;
	Scene_Map.prototype.startActorTargetting = function() {
		_startActorTargetting.call(this);
		var x = $gamePlayer.posX();
		var y = $gamePlayer.posY();
		if ($gameSystem.positionInRange(x, y)) {
			$gameTemp.showArea(x, y);
		}
	};

	// clear the AoE when you cancel targeting
	var _updateCallMenu = Scene_Map.prototype.updateCallMenu;
	Scene_Map.prototype.updateCallMenu = function() {
		if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_target' &&
		(Input.isTriggered('cancel') || TouchInput.isCancelled())) {
			$gameTemp.clearArea();
		}
		_updateCallMenu.call(this);
	};

	// check if the skill currently selected has an AoE
	Game_Temp.prototype.isSkillAoE = function() {
		var unit = $gameTemp.activeEvent();
		var actor = $gameSystem.EventToUnit(unit.eventId())[1];
		if (!actor) return false;
		var skill = actor.currentAction();
		if (!skill) return false;
		if (skill.area() <= 0) return false;
		return true;
	};

	// highlight the area of effect for an AoE
	Game_Temp.prototype.showArea = function(x, y, dir) {
		var unit = $gameTemp.activeEvent();
		var actor = $gameSystem.EventToUnit(unit.eventId())[1];
		if (!actor) return;
		var skill = actor.currentAction();
		if (!skill) return;
		var size = skill.area();
		var minSize = skill.minArea();
		var shape = skill.areaType();
		var dir = dir || unit.dirTo(x, y);
		this._activeAoE = {
			x: x, 
			y: y,
			size: size,
			minSize: minSize,
			shape: shape,
			dir: dir
		};
	};

	// clear out the highlighted area
	Game_Temp.prototype.clearArea = function() {
		this._activeAoE = null;
	};

	// AoE skills can select empty cells
	// modified by OhisamaCraft
	var _triggerAction = Game_Player.prototype.triggerAction;
	Game_Player.prototype.triggerAction = function() {
		if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_target') {
			if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
				
				var userArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
				var skill = userArray[1].currentAction();

				if ($gameTemp.selectArea(userArray[1], skill)) {
					
					//SoundManager.playOk();

					var action = $gameTemp.areaTargets().shift();
					var targetArray = $gameSystem.EventToUnit(action.event.eventId());
					// 戦闘開始ウィンドウを開始する（canUseの判定のため、先にsub phase設定する）
					$gameSystem.setSubBattlePhase('battle_window');
					// ターゲットイベントを設定する
					$gameTemp.setTargetEvent(action.event);
					//$gameTemp.setSrpgDistance($gameSystem.unitDistance($gameTemp.activeEvent(), action.event));
					// setup battle scene
					$gameSystem.setupSrpgBattleScene(userArray, targetArray);
					// special range isn't set, because the AoE will override it anyway

					// バトルウィンドウをスキップする設定で行動出来ない場合はターゲット選択に戻す
					var skill = userArray[1].currentAction().item();
					if (_srpgPredictionWindowMode === 3 && !userArray[1].canUse(skill)) {
						// actionの初期化
						targetArray[1].clearActions();
						// 行動タイミングと攻撃射程の初期化
						userArray[1].setActionTiming(-1);
						targetArray[1].setActionTiming(-1);
						userArray[1].clearSrpgRangeListForBattle();
						targetArray[1].clearSrpgRangeListForBattle();
						// 対象と距離の初期化
						$gameTemp.clearTargetEvent();
						$gameTemp.setSrpgDistance(0);
						// ターゲット選択に戻す
						$gameSystem.setSubBattlePhase('actor_target');
						return;
					} else {
						SoundManager.playOk();
						$gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
						if (_srpgPredictionWindowMode !== 3) $gameSystem.setSrpgStatusWindowNeedRefresh(userArray);
						$gameSystem.setSrpgBattleWindowNeedRefresh(userArray, targetArray);
						return true;
					}

				}
				
			}
		}
		return _triggerAction.call(this);
	};

	// Clear AoE targets when cancelling the big target
	var _selectPreviousSrpgBattleStart = Scene_Map.prototype.selectPreviousSrpgBattleStart;
	Scene_Map.prototype.selectPreviousSrpgBattleStart = function() {
		_selectPreviousSrpgBattleStart.call(this);
		$gameTemp.clearAreaTargets();
	};

	// Apply AoEs for auto units as well
	var _srpgInvokeAutoUnitAction = Scene_Map.prototype.srpgInvokeAutoUnitAction;
	Scene_Map.prototype.srpgInvokeAutoUnitAction = function() {
		// set up the AoE if it hasn't already been prepared
		if (!$gameTemp._activeAoE) {
			var mainTarget = $gameTemp.targetEvent();
			if (mainTarget && $gameSystem.positionInRange(mainTarget.posX(), mainTarget.posY())) {
				var userArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
				var skill = userArray[1].currentAction();
				if (skill.area() > 0) {
					$gameTemp.showArea(mainTarget.posX(), mainTarget.posY());
					$gameTemp.selectArea(userArray[1], skill);
					// the original target may not be who we end up hitting
					$gameTemp.setTargetEvent($gameTemp.areaTargets().shift().event);
				}
			}
		}
		_srpgInvokeAutoUnitAction.call(this);
	};

	// Find all the targets within the current AoE
	Game_Temp.prototype.selectArea = function(user, skill) {
		this.clearAreaTargets();
		var friends = (user.isActor()) ? 'actor' : 'enemy';
		var opponents = (user.isActor()) ? 'enemy' : 'actor';

		// check if the targets are limited
		var limit = skill.areaTargetLimit();

		// identify targets
		var targets = $gameMap.events().filter(function (event) {
			if (event.isErased()) return false;
			if ((event.isType() === friends && skill.isForFriend()) || 
			(event.isType() === opponents && skill.isForOpponent())) {
				return $gameTemp.inArea(event);
			}
		});

		// there are no targets!
		if (targets.length === 0) return false;

		// sort by distance
		var sortFunction;
		switch (skill.areaOrder()) {
			case 'random': // random order
				sortFunction = function (a, b) {
					return Math.random() - 0.5;
				};
				break;
			case 'far': // outside-in
				sortFunction = function (a, b) {
					var aDist = a.distTo($gameTemp.areaX(), $gameTemp.areaY());
					var bDist = b.distTo($gameTemp.areaX(), $gameTemp.areaY());
					return bDist - aDist;
				};
				break;
			case 'near': // inside-out (default)
			default:
				sortFunction = function (a, b) {
					var aDist = a.distTo($gameTemp.areaX(), $gameTemp.areaY());
					var bDist = b.distTo($gameTemp.areaX(), $gameTemp.areaY());
					return aDist - bDist;
				};
				break;
		}
		targets = targets.sort(sortFunction);

		// reduce the limit to fit if needed (0 or less means "no limit")
		if (limit <= 0 || limit > targets.length) limit = targets.length;

		// queue up actions on each target
		for (var i = 0; i < limit; i++) {
			this.addAreaTarget({
				item: skill.item(),
				event: targets[i]
			});
		}
		return true;
	};

	// work through the queue of actions
	// modified by OhisamaCraft
	var _srpgAfterAction = Scene_Map.prototype.srpgAfterAction;
	Scene_Map.prototype.srpgAfterAction = function() {
		var actionArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());

		if (actionArray[1].canMove() && $gameTemp.areaTargets().length > 0) {
			this.srpgBattlerDeadAfterBattle();
			var nextaction = $gameTemp.areaTargets().shift();
			actionArray[1].srpgMakeNewActions();
			actionArray[1].action(0).setItemObject(nextaction.item);
			var targetArray = $gameSystem.EventToUnit(nextaction.event.eventId());
			$gameTemp.setTargetEvent(nextaction.event);
			$gameTemp.setSrpgDistance($gameSystem.unitDistance($gameTemp.activeEvent(), nextaction.event));//shoukang refresh distance
			if (_refocus) {
				$gameTemp.setAutoMoveDestinationValid(true);
				$gameTemp.setAutoMoveDestination($gameTemp.targetEvent().posX(), $gameTemp.targetEvent().posY());
			}
			actionArray[1].setShouldPayCost(false);
			$gameSystem.setSubBattlePhase('invoke_action');
			this.srpgBattleStart(actionArray, targetArray);
		} else {
			$gameTemp.clearArea();
			$gameTemp.clearAreaTargets();
			this.allBattlerSetShouldPayCost(true);
			_srpgAfterAction.call(this);
		}
	};

	Scene_Map.prototype.allBattlerSetShouldPayCost = function(flag) {
		$gameMap.events().forEach(function(event) {
            if (event.isType() === 'actor' || event.isType() === 'enemy') {
                var battler = $gameSystem.EventToUnit(event.eventId())[1];
				battler.setShouldPayCost(flag);
            }
        });
	};

	// override this to allow the AI to use fancy AoEs
	Game_System.prototype.srpgAIUnderstandsAoE = false;

	// AoE skills can be used as long as you're in the targeted area
	var _canUse = Game_BattlerBase.prototype.canUse;
	Game_BattlerBase.prototype.canUse = function(item) {
		if (item && $gameSystem.isSRPGMode() && this._srpgActionTiming !== 1 &&
		Number(item.meta.srpgAreaRange) > 0) {
			// stop default AI from using AoEs with holes
			if (!$gameSystem.srpgAIUnderstandsAoE &&
			$gameSystem.isBattlePhase() !== "actor_phase" &&
			Number(item.meta.srpgAreaMinRange) > 0) {
				return false;
			}

			if ($gameSystem.isSubBattlePhase() === 'invoke_action' ||
			$gameSystem.isSubBattlePhase() === 'auto_actor_action' ||
			$gameSystem.isSubBattlePhase() === 'enemy_action' ||
			$gameSystem.isSubBattlePhase() === 'battle_window') {
				return $gameTemp.inArea($gameTemp.targetEvent()) || item.meta.cellTarget; //shoukang edit: check cellTarget tag
			}
		}
		return _canUse.call(this, item);
	};

	var _srpgBattle_isEnabled = Window_SrpgBattle.prototype.isEnabled;
	Window_SrpgBattle.prototype.isEnabled = function(item) {
		if (item && Number(item.meta.srpgAreaRange) > 0) {
			return this._actor && this._actor.canUse(item);
		}
		return _srpgBattle_isEnabled.call(this, item);
	};

//====================================================================
// Sprite_SrpgAoE
//====================================================================
	Sprite_SrpgAoE.prototype.initialize = function() {
		Sprite.prototype.initialize.call(this);
		this.anchor.x = 0.5;
		this.anchor.y = 0.5;
		this._frameCount = 0;
		this._posX = -1;
		this._posY = -1;
		this.z = 0;
		this.visible = false;
	};

	Sprite_SrpgAoE.prototype.isActive = function() {
		return this._posX >= 0 && this._posY >= 0;
	};

	Sprite_SrpgAoE.prototype.update = function() {
		Sprite.prototype.update.call(this);
		if (this.isActive()){
			this.updatePosition();
			this.updateAnimation();
			this.visible = true;
		} else {
			this.visible = false;
		}
	};

	Sprite_SrpgAoE.prototype.setAoE = function(x, y, size, minSize, type, dir) {
		this._posX = x;
		this._posY = y;
		this.blendMode = 1;

		if (this._size != size || this._minSize != minSize || this._type != type || this._dir != dir) {
			this._size = size;
			this._type = type;
			this._dir = dir;
			this.redrawArea(size, minSize, type, dir);
		}
	};

	Sprite_SrpgAoE.prototype.redrawArea = function(size, minSize, type, dir) {
		var tileWidth = $gameMap.tileWidth();
		var tileHeight = $gameMap.tileHeight();
		this.bitmap = new Bitmap(tileWidth*(1+size*2), tileHeight*(1+size*2));

		if (!_oneSquare && size <= 0) return;

		for (var x = 0; x < 1+size*2; x++) {
			for (var y = 0; y < 1+size*2; y++) {
				if ($gameMap.inArea(x-size, y-size, size, minSize, type, dir)) {
					this.drawCell(this.bitmap, x*tileWidth, y*tileHeight, tileWidth, tileHeight);
				}
			}
		}
	};

	Sprite_SrpgAoE.prototype.drawCell = function(bitmap, x, y, tileWidth, tileHeight) {
		bitmap.fillRect(x, y, tileWidth, tileHeight, _areaColor);
	};

	// modified by OhisamaCraft
	Sprite_SrpgAoE.prototype.clearArea = function() {
		$gameTemp.setSrpgAllTargetInRange(false);
		this._posX = -1;
		this._posY = -1;
	};

	Sprite_SrpgAoE.prototype.updatePosition = function() {
		var tileWidth = $gameMap.tileWidth();
		var tileHeight = $gameMap.tileHeight();
		this.x = ($gameMap.adjustX(this._posX) + 0.5) * tileWidth;
		this.y = ($gameMap.adjustY(this._posY) + 0.5) * tileHeight;
	};

	Sprite_SrpgAoE.prototype.updateAnimation = function() {
		this._frameCount++;
		this._frameCount %= 40;
		this.opacity = (40 - this._frameCount) * 3;
	};

    Sprite_SrpgMoveTile.prototype.setThisMoveTile = function(x, y, attackFlag) {
        this._frameCount = 0;
        this._posX = x;
        this._posY = y;
        if ($gameTemp.isSrpgAllTargetInRange() === true) {
            this.bitmap.fillAll(_areaColor);
        } else {
            if (attackFlag === true) {
                this.bitmap.fillAll('red');
            } else {
                this.bitmap.fillAll('blue');
            }    
        }
    }

//====================================================================
// Spriteset_Map
//====================================================================

	// add the AoE sprite to the list
	var _Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
	Spriteset_Map.prototype.createTilemap = function() {
		_Spriteset_Map_createTilemap.call(this);
		this._srpgAoE = new Sprite_SrpgAoE();
		this._tilemap.addChild(this._srpgAoE);
	};

	var _Spriteset_Map_update = Spriteset_Map.prototype.update;
	Spriteset_Map.prototype.update = function() {
		_Spriteset_Map_update.call(this);
		if ($gameSystem.isSRPGMode()) {
			this.updateSrpgAoE();
		}
	};

	// refresh the AoE sprite
	Spriteset_Map.prototype.updateSrpgAoE = function() {
		var aoe = $gameTemp._activeAoE;
		if (aoe) {
			this._srpgAoE.setAoE(aoe.x, aoe.y, aoe.size, aoe.minSize, aoe.shape, aoe.dir);
		} else {
			this._srpgAoE.clearArea();
		}
	};

})();
