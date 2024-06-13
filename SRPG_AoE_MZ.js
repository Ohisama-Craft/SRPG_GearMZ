//-----------------------------------------------------------------------------
// SRPG_AoE_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPG area-of-effect skills, edited by OhisamaCraft.
 * @author Dr. Q + アンチョビ, Boomy, Shoukang
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
 * @param standard X
 * @desc The center X position in battle scene, default Graphics.boxWidth / 2
 * @default Graphics.boxWidth / 2
 * 
 * @param standard Y
 * @desc The center Y position in battle scene, default Graphics.boxHeight / 2
 * @default Graphics.boxHeight / 2
 * 
 * @param x range
 * @desc x direction battler placement range in battle scene, default Graphics.width - 360
 * @default Graphics.width - 360
 *
 * @param y range
 * @desc y direction battler placement range in battle scene, default Graphics.height / 3.5
 * @default Graphics.height / 3.5
 * 
 * @param tilt
 * @desc parameter that tilt x direction placement to simulate a 3D view, default 0.2
 * @default 0.2
 *
 * @param allow surrounding
 * @desc if disabled skill user will never be surrounded by targets. See help for detail
 * @type boolean
 * @default true
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
 * allActor - all actors within range
 * <srpgAreaRange:x> must be set to 1 or greater.
 * 
 * allEnemy - All enemies within range
 * <srpgAreaRange:x> must be set to 1 or greater.
 * 
 * Note: allActor, allEnemy directly specifies Actor and Enemy (unlike Friend, opponent).
 * Therefore, it is necessary to create different skills for Actor and Enemy.
 * Actor attacks Enemy -> skill with allEnemy in the tag
 * Enemy attacks Actor -> allActor tag
 *
 * Script calls for advanced users:
 *  yourEvent.battlersNear(size, minSize, 'shape', [direction])
 *  yourEvent.enemiesNear(size, minSize, 'shape', [direction])
 *  yourEvent.actorsNear(size, minSize, 'shape', [direction])
 *
 * Returns a list of actors/enemies/both near the specified event, supporting
 * the same AoE shapes listed above. If you use a directional AoE shape and no
 * direction is specified, it will point where your event is facing
 * ================================================================================
 * AoE Animation help
 * ================================================================================
 * When an AoE spell is cast and more than 1 target is selected ($gameTemp.areaTargets), 
 * each target is added to a queue and then the game will execute each battle individually 1 on 1
 * This script will collect all targets and add them into one battle for a 1 vs many scenario
 * Works best with animations set to SCREEN though animations that target individuals still work 
 * (they just happened sequentially on the same battle field)
 *
 * AoE rules in this plugin:
 * 1. If an enemy cast AoE to actors, the battle exp will be shared by all actors in battle equally.
 * 2. If you use AGI attack, AoE skill will hit every target first, then targets will do counter attacks.
 *
 * Important Tips:
 * With this plugin, it's necessary to set skill target to all enemies/friends to make AoEs work properly.
 * If you allow surrounding and you use dynamic motion, actor sprite priority may become weird 
 * while casting skills, to avoid this, set the plugin parameter 'usePriority' in dynamic motion to false.
 * Once you find anything weird, try to turn of this plugin and see if it happens again. 
 * This will help us identify which plugin causes the error.
 * ==================================================================================================
 * Positions battlers in Battle scene:
 * All battlers will be placed based on their relative positions. For example in this map position:
 * [ . T .]    Battle scene will look like: [ . T .]                     [ . T .]
 * [ T C T]    ========================>    [ T . U] when user is actor, [ U . T] when user is enemy.
 * [ . U .]                                 [ . T .]                     [ . T .]
 *
 * U: skill user, T: target, C; AoE center
 *
 * The battle scene will look like:
 * [ C T .]    Battle scene will look like: [ T . .]                     [ . . T]
 * [ T U .]    ========================>    [ . . U] when user is actor, [ U . .] when user is enemy.
 * [ . . .]                                 [ T . .]                     [ . . T]
 *
 * The placement will automatically adjust battlers' distance to make them reasonable.(within the defined x and y range)
 * ===================================================================================================
 * Credits to: Dopan, Dr. Q, Traverse, SoulPour777
 * ===================================================================================================
 * 
 * ================================================================================
 * Note / Modification by Ohisama Craft
 * ================================================================================
 * -Add SRPG_AoEAnimation.js
 * -Corrected cost consumption (changed from gameTemp to gameBattler to counter action)
 * -Added allActor / allEnemy to AoE shape (targets all actors / enemies within range)
 * -Supports Game_Player.prototype.triggerAction for SRPGgearMV
 * -Japanese translation of help
 * 
 */


/*:ja
 * @target MZ
 * @plugindesc SRPG戦闘で範囲攻撃（スキル）を実装します(SRPG_gearMV用)
 * @author Dr. Q + アンチョビ, Boomy, Shoukang, おひさまクラフト
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
 * @param standard X
 * @desc 戦闘シーンで中心となるX座標　デフォルト Graphics.boxWidth / 2
 * @default Graphics.boxWidth / 2
 * 
 * @param standard Y
 * @desc 戦闘シーンで中心となるY座標　デフォルト Graphics.boxHeight / 2
 * @default Graphics.boxHeight / 2
 * 
 * @param x range
 * @desc 戦闘シーンでバトラーを配置するX方向の範囲　デフォルト Graphics.width - 360
 * @default Graphics.width - 360
 *
 * @param y range
 * @desc 戦闘シーンでバトラーを配置するY方向の範囲　デフォルト Graphics.height / 3.5
 * @default Graphics.height / 3.5
 * 
 * @param tilt
 * @desc 戦闘シーンで3D表示らしい配置にするためのX方向の傾き値　デフォルト 0.2
 * @default 0.2
 *
 * @param allow surrounding
 * @desc スキルの使用者がターゲットに囲まれることを許可するか。詳細はヘルプ参照。
 * @type boolean
 * @default true
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
 * 注：allActor, allEnemyは、アクターとエネミーを直接指定します（Friend, opponentとは違います）。
 * 　　そのため、アクターとエネミーで異なるスキルを制作する必要があります。
 * 　　・アクターがエネミーを攻撃する→allEnemyをタグに記述したスキル
 * 　　・エネミーがアクターを攻撃する→allActorをタグに記述したスキル
 *
 * 慣れた人向け　スクリプトで使用できるコマンド:
 *  yourEvent.battlersNear(size, minSize, 'shape', [direction])
 *  yourEvent.enemiesNear(size, minSize, 'shape', [direction])
 *  yourEvent.actorsNear(size, minSize, 'shape', [direction])
 *
 * 指定したイベントを中心としたAoEの範囲内にいるアクター/エネミー/両方のリストを返します。
 * 指向性のあるAoEを使用し、directionが指定されていない場合、イベントの向きをdirectionとします。
 * 
 * ================================================================================
 * SRPG_AoE Animationのヘルプ
 * ================================================================================
 * AoEによって効果範囲のあるスキルが使用され、複数のターゲットが存在する場合($gameTemp.areaTargets)、
 * それぞれのターゲットはキューに追加され、1対1の戦闘シーンとして順次実行されます。
 * AoE Animationは、全てのターゲットを1つの戦闘シーンにまとめ、1対多数の戦闘シーンを実現します。
 * 表示位置が『画面』に設定されたアニメーションに適していますが、
 * 個別に表示されるアニメーションでも問題なく使用することが出来ます（順次表示されます）。
 *
 * このプラグイン内でのAoEルール:
 * 1. エネミーが複数のアクターに行動を行った場合、経験値は戦闘に参加したアクター全員で均等に分配します。
 * 2. 敏捷に応じて行動する場合でも、AoEスキルは始めにターゲット全体に使用され、次いでターゲットが応戦します。
 *
 * 重要なTips:
 * このプラグインでは、AoEを正しく動作させるため、スキルの範囲をすべての敵/味方に設定する必要があります。
 * 周囲を囲むことを許可してdynamic motion.jsを使用すると、アクターのスプライトの優先順位がおかしくなることがあります。
 * これを避けるには、dynamic motionのプラグインパラメータ'usePriority'をfalseに設定します。
 * 不具合が生じた場合は、いったんこのプラグインをOFFにして問題が再現されるか確認してください。
 * このような方法は、どのプラグインがエラーの原因か推測するのに役立ちます。
 * ==================================================================================================
 * 戦闘シーンでのバトラーの配置:
 * 全てのバトラーは相対的な位置に基づいて配置されます。
 * 例:
 * [ . T .]    戦闘シーンでは              : [ . T .]                     [ . T .]
 * [ T C T]    ========================>    [ T . U] ユーザーがアクター , [ U . T] ユーザーがエネミー
 * [ . U .]                                 [ . T .]                     [ . T .]
 *
 * U: skill user, T: target, C; AoE center
 *
 * 例２:
 * [ C T .]    戦闘シーンでは              : [ T . .]                     [ . . T]
 * [ T U .]    ========================>    [ . . U] ユーザーがアクター , [ U . .] ユーザーがエネミー
 * [ . . .]                                 [ T . .]                     [ . . T]
 *
 * 配置の際は自動的にバトラーとの距離を調整します。
 * ===================================================================================================
 * Credits to: Dopan, Dr. Q, Traverse, SoulPour777
 * ===================================================================================================
 * 
 * ================================================================================
 * 注 / おひさまクラフトによる改変内容 ('modified by OhisamaCraft'で検索)
 * ================================================================================
 * ・SRPG_AoEAnimation.jsを統合
 * ・コスト消費の修正（応戦に対応するためgameTempからgameBattlerに変更）
 * ・<srpgAreaType:y> (AoE shape) に allActor, allEnemy を追加（射程範囲内のすべてのactor/enemyを対象とする）
 * ・Game_Player.prototype.triggerActionをSRPGgearMVに対応
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
    var _standardX = parameters['standard X'] || 'Graphics.boxWidth / 2';
	var _standardY = parameters['standard Y'] || 'Graphics.boxHeight / 2';
    var _xRange = parameters['x range'] || 'Graphics.width - 360';
    var _yRange = parameters['y range'] || 'Graphics.height / 3.5';
    var _tilt = Number(parameters['tilt'] || 0.2);
    var _surround = !!eval(parameters['allow surrounding']);

	var coreParameters = PluginManager.parameters('SRPG_core_MZ');
	var _srpgPredictionWindowMode = Number(coreParameters['srpgPredictionWindowMode'] || 1);

//====================================================================
// Compatibility with plugins expecting SRPG_AreaAttack.js
//====================================================================

	// modified by OhisamaCraft
	Game_Temp.prototype.isFirstAction = function(action) {
		//return !!(battler.shouldPayCost());
		return !action.isHideAnimation();
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
	*/

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
	var _AoE_startActorTargetting = Scene_Map.prototype.startActorTargetting;
	Scene_Map.prototype.startActorTargetting = function() {
		_AoE_startActorTargetting.call(this);
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
	Scene_Map.prototype.setupAoEforAutoUnits = function() {
		// set up the AoE if it hasn't already been prepared
		if (!$gameTemp._activeAoE) {
			let mainTarget = $gameTemp.targetEvent();
			if (mainTarget && $gameSystem.positionInRange(mainTarget.posX(), mainTarget.posY())) {
				let userArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
				let skill = userArray[1].currentAction();
				if (skill.area() > 0) {
					$gameTemp.showArea(mainTarget.posX(), mainTarget.posY());
					$gameTemp.selectArea(userArray[1], skill);
					// the original target may not be who we end up hitting
					$gameTemp.setTargetEvent($gameTemp.areaTargets().shift().event);
				}
			}
		} else {
			// AI controlで事前にAoEが設定されている場合に対応する
			let userArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
			let user = userArray[1];
			let skill = userArray[1].currentAction();
			$gameTemp.selectArea(user, skill);
			$gameTemp.setTargetEvent($gameTemp.areaTargets().shift().event);
		}
	};

	// Find all the targets within the current AoE
	Game_Temp.prototype.selectArea = function(user, skill) {
		if (!user || !skill) return false;
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

	/*
	// work through the queue of actions
	// modified by OhisamaCraft
	var _srpgAfterAction = Scene_Map.prototype.srpgAfterAction;
	Scene_Map.prototype.srpgAfterAction = function() {
		var actionArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());

		if (actionArray[1].canMove() && $gameTemp.areaTargets().length > 0) {
			this.srpgBattlerDeadAfterBattle();
			var nextaction = $gameTemp.areaTargets().shift();
			user.srpgMakeNewActions();
			user.action(0).setItemObject(nextaction.item);
			var targetArray = $gameSystem.EventToUnit(nextaction.event.eventId());
			$gameTemp.setTargetEvent(nextaction.event);
			$gameTemp.setSrpgDistance($gameSystem.unitDistance($gameTemp.activeEvent(), nextaction.event));//shoukang refresh distance
			if (_refocus) {
				$gameTemp.setAutoMoveDestinationValid(true);
				$gameTemp.setAutoMoveDestination($gameTemp.targetEvent().posX(), $gameTemp.targetEvent().posY());
			}
			user.setShouldPayCost(false);
			$gameSystem.setSubBattlePhase('invoke_action');
			this.srpgBattleStart(userArray, targetArray);
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
	*/

	// override this to allow the AI to use fancy AoEs
	Game_System.prototype.srpgAIUnderstandsAoE = false;

	// AoE skills can be used as long as you're in the targeted area
	// SRPG_coreに統合
	/*
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
	*/

	var _srpgBattle_isEnabled = Window_SrpgBattle.prototype.isEnabled;
	Window_SrpgBattle.prototype.isEnabled = function(item) {
		if (item && Number(item.meta.srpgAreaRange) > 0) {
			return this._actor && this._actor.canUse(item);
		}
		return _srpgBattle_isEnabled.call(this, item);
	};

	// fix bug for not clearing area after searching targets.
    var _Scene_Map_prototype_srpgAICommand = Scene_Map.prototype.srpgAICommand
    Scene_Map.prototype.srpgAICommand = function() {
        var result = _Scene_Map_prototype_srpgAICommand.call(this);
        if (!result){
            $gameTemp.clearAreaTargets();
            $gameTemp.clearArea();
        }
        return result;
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
		if ($gameSystem.isSRPGMode() || this._srpgAoE.isActive()) {
			this.updateSrpgAoE();
		}
	};

	// refresh the AoE sprite
	Spriteset_Map.prototype.updateSrpgAoE = function() {
		const aoe = $gameTemp._activeAoE;
		if (aoe) {
			this._srpgAoE.setAoE(aoe.x, aoe.y, aoe.size, aoe.minSize, aoe.shape, aoe.dir);
		} else {
			this._srpgAoE.clearArea();
		}
	};

//============================================================================================
//Battler position in AoE(when there are areaTargets) scene battle 
//============================================================================================
    // remove actor sprite limit
    const _Spriteset_Battle_createActors = Spriteset_Battle.prototype.createActors
    Spriteset_Battle.prototype.createActors = function() {
        if ($gameSystem.isSRPGMode() && $gameTemp.areaTargets().length > 0){
            this._actorSprites = [];
            for (var i = 0; i < $gameParty.SrpgBattleActors().length; i++) {
				const sprite = new Sprite_Actor();
				this._actorSprites.push(sprite);
				this._battleField.addChild(sprite);
            }          
        } else{
            _Spriteset_Battle_createActors.call(this);
        }
    };

    //sort to get priority right
	/*
    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function() {
        _Spriteset_Battle_createLowerLayer.call(this);
        if ($gameSystem.isSRPGMode() && $gameTemp.areaTargets().length > 0){
            this._battleField.children.sort(this.compareEnemySprite.bind(this));
        }
    };
	*/
	const _Spriteset_Battle_updateBattleback = Spriteset_Battle.prototype.updateBattleback;
	Spriteset_Battle.prototype.updateBattleback = function() {
		if ($gameSystem.isSRPGMode() && $gameTemp.areaTargets().length > 0){
            if (!this._battlebackLocated) {
				this._back1Sprite.adjustPosition();
				this._back2Sprite.adjustPosition();
				this._battleField.children.sort(this.compareEnemySprite.bind(this));
				this._battlebackLocated = true;
			}
        } else {
			_Spriteset_Battle_updateBattleback.call(this);
		}
	};

    var _SRPG_Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function (index) {
        if ($gameSystem.isSRPGMode() == true && !$gameSystem.useMapBattle() && $gameTemp.areaTargets().length > 0) {
            var param = $gameTemp._aoePositionParameters;
            var battler = this._battler;
            this.setHome(eval(_standardX) + (battler.aoeSceneX() - param.midX) * param.amplifyX,
                         eval(_standardY) + (battler.aoeSceneY() - param.midY) * param.amplifyY);
            this.moveToStartPosition();
        } else {
            _SRPG_Sprite_Actor_setActorHome.call(this, index);
        }
    };

    //Set enemy positions
    const _SRPGAoE_Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        if ($gameSystem.isSRPGMode() == true && !$gameSystem.useMapBattle() && $gameTemp.areaTargets().length > 0) {
            this.clear();
            this._troopId = troopId;
            this._enemies = [];
            var param = $gameTemp._aoePositionParameters;
            for (var i = 0; i < this.SrpgBattleEnemys().length; i++) {
                var battler = this.SrpgBattleEnemys()[i];
                battler.setScreenXy(eval(_standardX) + (battler.aoeSceneX() - param.midX) * param.amplifyX,
                                    eval(_standardY) + (battler.aoeSceneY() - param.midY) * param.amplifyY);
                this._enemies.push(battler);
            }
            //this.makeUniqueNames();
        } else {
            _SRPGAoE_Game_Troop_setup.call(this, troopId);
        }
    };

// shoukang: complicated vector calculation to determine the battler placement parameters and relative position.
	Game_System.prototype.setBattlerPosition = function(){
        var activeEvent = $gameTemp.activeEvent();
        var allEvents = [activeEvent, $gameTemp.targetEvent()].concat($gameTemp.getAreaEvents());
        var vector =  this.createSrpgAoEVector();
        var vectorX = vector[0];
        var vectorY = vector[1];
        var vectorLen = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
        var minX = 0;
        var maxX = 0.5;
        var minY = -1.25;
        var maxY = 1.25;
        var targetMinX = 0.5;

        for (var i = 0; i < allEvents.length; i++){
            var battler = $gameSystem.EventToUnit(allEvents[i].eventId())[1];
            var posX = allEvents[i].posX() - activeEvent.posX();
            var posY = allEvents[i].posY() - activeEvent.posY();
            var projectionY = (vectorY * posX - vectorX * posY) / vectorLen;
            var projectionX = _tilt * projectionY + (vectorX * posX + vectorY * posY) / vectorLen; //0.2 * sin helps to make a better veiw.
            battler.setAoEScenePosition(projectionX, projectionY);
            if (i > 0) targetMinX = Math.min(projectionX, targetMinX);
            minX = Math.min(projectionX, minX);
            minY = Math.min(projectionY, minY);
            maxX = Math.max(projectionX, maxX);
            maxY = Math.max(projectionY, maxY);
        }

        if (!_surround && targetMinX < 0.5){
            minX -= Math.max((maxX - targetMinX) / 2, 0.5);
            $gameSystem.EventToUnit(activeEvent.eventId())[1].setAoEScenePosition(minX, 0);
        }
        var direction = $gameSystem.EventToUnit(activeEvent.eventId())[0] === 'actor' ? -1 : 1;
        var amplifyX = direction * eval(_xRange) / Math.max((maxX - minX), 2);
        var amplifyY = eval(_yRange) / (maxY - minY);
        $gameTemp.setAoEPositionParameters((minX + maxX) / 2, (minY + maxY) / 2, amplifyX, amplifyY);
    }

    Game_System.prototype.createSrpgAoEVector = function(){
        var activeEvent = $gameTemp.activeEvent();
        var vectorX = $gameTemp.areaX() - activeEvent.posX();
        var vectorY = $gameTemp.areaY() - activeEvent.posY();

        // if aoe center overlap with active event, use active event direction as vector.
        if (Math.abs(vectorX) + Math.abs(vectorY) === 0){
            var dir = activeEvent.direction();
            vectorX = $gameMap.roundXWithDirection(0, dir);
            vectorY = $gameMap.roundYWithDirection(0, dir);
        }
        return [vectorX, vectorY]
    }

    Game_Battler.prototype.setAoEScenePosition = function(x, y){
        this._aoeSceneX = x;
        this._aoeSceneY = y;
    }

    Game_Battler.prototype.aoeSceneX = function(){
        return this._aoeSceneX;
    }

    Game_Battler.prototype.aoeSceneY = function(){
        return this._aoeSceneY;
    }

    Game_Temp.prototype.setAoEPositionParameters = function(midX, midY, amplifyX, amplifyY){
        this._aoePositionParameters = {
            midX : midX,
            midY : midY,
            amplifyX : amplifyX,
            amplifyY : amplifyY,
        }
    }

// ==========================================================================
// repeated AoE action that doesn't show animation and doesn't cost tp, mp
// ==========================================================================
    Game_Action.prototype.setHideAnimation = function(val){
        this._hideAnimation = val;
    }
    // only work with my bugfixed srpg_DynamicAction
	// Also used for log window display in map battles (Ohisama Craft)
    Game_Action.prototype.isHideAnimation = function(){
        return this._hideAnimation;
    }

    Game_Action.prototype.setEditedItem = function(item){
        this._editedItem = item;
    }    

    // set up Action that and item that has no animation and no cost for repetation
    Game_Action.prototype.createAoERepeatedAction = function(){
        var hiddenAction = new Game_Action(this.subject());
        var noCostItem = {
            ...this.item()
        }
        noCostItem.mpCost = 0;
        noCostItem.tpCost = 0;
        noCostItem.srpgDataClass = this._item._dataClass;
        hiddenAction.setItemObject(this.item());
        hiddenAction.setEditedItem(noCostItem);
        hiddenAction.setHideAnimation(true);
        return hiddenAction;
    }    

    var _Game_Action_item = Game_Action.prototype.item;
    Game_Action.prototype.item = function() {
        if (this._editedItem) return this._editedItem;
        return _Game_Action_item.call(this);
    };

    Game_Action.prototype.canAgiAttack = function(action){
        return this.isForOpponent() && !this.item().meta.doubleAction;
    }

//============================================================================================
//A hack way to get AoE counter attack distance correct.
//============================================================================================
/*
    Game_Battler.prototype.setAoEDistance = function(val){
        this._AoEDistance = val;
    }

    Game_Battler.prototype.AoEDistance = function(){
        return this._AoEDistance;
    }

    Game_Battler.prototype.clearAoEDistance = function(){
        this._AoEDistance = undefined;
    }
*/
    //let our faked skill item considered as skill
    var _DataManager_isSkill = DataManager.isSkill;
    DataManager.isSkill = function(item) {
        return _DataManager_isSkill.call(this, item) || (item && item.srpgDataClass === 'skill');
    };

})();
