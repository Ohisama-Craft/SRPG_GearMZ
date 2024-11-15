//-----------------------------------------------------------------------------
// SRPG_AIControl_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPG advanced AI (v0.9), edited by OhisamaCraft.
 * @author Dr. Q
 * @base SRPG_core_MZ
 * @base SRPG_RangeControl_MZ
 * @orderAfter SRPG_core_MZ
 * @orderAfter SRPG_RangeControl_MZ
 * @orderAfter SRPG_AoE_MZ
 * @orderAfter SRPG_PositionEffects_MZ
 * 
 * @param Target Formula
 * @desc Default formula for picking a target
 * The one with the highest value is chosen
 * @default 1
 * 
 * @param Move Formula
 * @desc Default formula for choosing where to move
 * @default nearestOpponent
 * 
 * @help
 * copyright 2020 SRPG Team. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * This plugin is a work in progress!
 *
 * Requires SRPG_RangeControl, place this plugin below it.
 * If you are using SRPG_AoE and/or SRPG_PositionEffects, place this plugin
 * below those as well.
 *
 * Allows the AI to utilize anyTarget and AoE skills, and gives you more control
 * over the behavior of different enemies and actors
 *
 * The formulas in this plugin are meant for advanced users with some knowledge
 * of javascript.
 *
 * New skill tags:
 * <aiIgnoreAiming>     ignores aimingActor and aimingEvent tags
 * <aiIgnoreTgr>        ignores Target Rate parameter
 * <aiFriendRate:X>     multiplier for the target score of friends
 * <aiOpponentRate:X>   multiplier for the target score of opponents
 * <aiTarget: formula>  custom Target Formula for this skill
 * <aiMove: formula>    custom Move Formula when self-targeting this skill
 * 
 * New actor, class, and enemy tags:
 * <aiTarget: formula>  default Target Formula for this unit
 * <aiMove: formula>    default Move Formula for this unit
 *
 * New event tag:
 * <aiFlag:type>        give the event a flag that AI can use to navigate
 *
 * New actor, class, enemy, weapon, armor, skill, and state tag:
 * <aiIgnore>           this unit is completely invisible to AI units
 *
 * Unlike setting a unit's Target Rate to 0, <aiIgnore> bypasses the
 * <aimingEvent:X> and <aimingActor:X> tags, and also nearestFriend,
 * nearestOpponent, mostFriends, and mostOpponents values in Move
 * Formulas.
 *
 * New script call:
 * event.setAiFlag('ABC')   changes the event's flag to ACB
 * event.clearAiFlag()      removes the event's flag
 *
 * ------------------------
 * TARGET FORMULAS
 * ------------------------
 *
 * After choosing a skill the AI will examine all possible targets within range,
 * from all possible positions, and select the one with the highest Target Score.
 * Targets with a score of 0 or less are ignored.
 *
 * Target Score is calculated by multiplying the result of the Target Formula by
 * the Target Rate (tgr) stat. If a unit has a target rate of 0% it will be the
 * ignored by allies and enemies alike. Putting <aiIgnoreTgr> will ignore Target
 * Rate for this skill, including a target rate of 0.
 *
 * AoE skills combine the score of all targets in the area, so they usually
 * choose the option that hits the most targets.
 *
 * If you use the <aiFriendRate> or <aiOpponentRate> notetags on the skill, it
 * applies an additional multiplier to their target score, on top of Target Rate.
 * If set to 0, the AI will ignore units of that team as if they had 0 TGR, but
 * if set to a negative number, the AI will actively avoid hitting them with AoEs.
 * Larger negative values will avoid allies more urgently.
 * An AoE that hits two opponents and one friend would have the score of
 * opponent A + opponent B - friend A.
 *
 * In addition to the default formula in the plugin parameters, you can add
 * a default formula to a class, actor, or enemy, or have a formula specific
 * to that skill.
 *
 * If you use <mode:aimingActor> or <mode:aimingEvent>, then the specified
 * target will take priority over all other targets whenever it is valid.
 *
 * The following values can be used in target formulas:
 * s[n]         value of switch n
 * v[n]         value of variable n
 * user         the user of the skill
 * target       the target of the skill being evaluated
 * a            (same as user)
 * b            (same as target)
 * item         the skill being used
 * distance     distance moved to the destination
 * region       region ID of the destination space
 * terrain      terrain tag of the destination space
 * tag          (same as terrain)
 * damageFloor  = 1 if the destination space is a damage floor, = 0 otherwise
 * range        distance from the destination to the target
 * front        = 1 if the target will be hit from the front, = 0 otherwise
 * back         = 1 if the target will be hit from the back, = 0 otherwise
 * side         = 1 if the target will be hit from the side, = 0 otherwise
 *
 * Examples:
 *
 * <aiTarget: 4 * a.atk - 2 * b.def> chooses the target who takes the most
 * damage from the default damage formula, ignoring targets who take no damage.
 *
 * <aiTarget: a.hp - b.atk> chooses the target with the lowest attack, ignoring
 * targets whose attack is more than your current health.
 *
 * <aiTarget: 1-b.hpRate()> chooses the target with the lowest HP %, ignoring
 * anyone who is unhurt. This is especially useful on healing skills
 *
 * <aiTarget: 1 + back> <aiFriendRate:-1> chooses opponents it can hit from the
 * back, but avoids friends and especially avoids friends it would hit from the
 * back. This is useful for an AoE that can hit friends and opponents alike.
 *
 * <aiTarget: range> chooses the target it can hit at the furthest range.
 *
 * ------------------------
 * MOVE FORMULAS
 * ------------------------
 *
 * If the AI has a target, it moves to the best
 *
 * However, if the AI isn't using an action, can't find any targets, or if the
 * action is targeting itself, the AI will use the Move Formula to decide where
 * it should go.
 *
 * The AI will check every unoccupied position within movement range, including
 * its current position, and move to the one with the highest (or least
 * negative) score. If multiple positions have the same score, it will choose
 * the closest one.
 *
 * In addition to the default formula in the plugin parameters, you can add a
 * default formula to a class, actor, or enemy.
 *
 * Move formulas specified on the skill are only used if the skill is targeting
 * user- for example, fleeing while healing, or moving to allies when guarding.
 *
 * If you use an any of the <mode:> tags on an event, it will override the unit's
 * default Move Formula. Refer to SRPG_core for the list of modes.
 *
 * The following values can be used in move formulas:
 * s[n]              value of switch n
 * v[n]              value of variable n
 * user              the unit who is moving
 * a                 (same as user)
 * distance          distance moved
 * region            region ID of the destination
 * terrain           terrain tag of the destination
 * tag               (same as terrain)
 * damageFloor       = 1 if the destination is a damage floor
 * nearestFriend     distance to nearest friend (negative)
 * nearestOpponent   distance to nearest opponent (negative)
 * nearestUnitEvent  distance to nearest unitEvent (negative)
 * mostFriends       combined distance to all friends (negative)
 * mostOpponents     combined distance to all opponents (negative)
 * nearestFlag['type']  distance to nearest flag event of type
 * mostFlags['type']    combined distance to all flag events of type
 *
 * Flags are events with an <aiFlag:type> notetag, and can be actors,
 * enemies, objects, or any other kind of event, even ones that have no effect
 * on the battle otherwise. You can use them to give AI units more information
 * about the map, such as good positions for archers to wait, or dangerous
 * chokepoints those units should avoid. Since flags are on events, they can be
 * be moved around the map or erased to represent a changing situation
 *
 * Examples:
 *
 * <aiMove: nearestOpponent> will move toward the nearest opponent unit
 *
 * <aiMove: nearestOpponent - damageFloor*2> will move toward the nearest
 * opponent, but will stop upt to 2 space early to avoid damage floors
 *
 * <aiMove: mostOpponents> will move toward the largest group of opponents, but
 * wanders a bit if they are too spread out
 *
 * <aiMove: a.hpRate() > 0.5 ? nearestOpponent : mostFriends> will approach the
 * enemy while HP is above 50%, but run to safety when wounded
 *
 * <aiMove: region> will move to the space with the highest region it can reach.
 * if there's no higher region nearby, it will stand still.
 *
 * <aiMove: -region> is the same, but favors to the lowest-numbered region.
 *
 * <aiMove: nearestFlag['protect']> will move toward the nearest event with the
 * <aiFlag:protect> notetag on it, even if the event is an opponent or hidden
 * event that doesn't affect the battle.
 */

/*:ja
 * @target MZ
 * @plugindesc SRPG強化AI (v0.9)、おひさまクラフトによる改変。
 * @author Dr. Q
 * @base SRPG_core_MZ
 * @base SRPG_RangeControl_MZ
 * @orderAfter SRPG_core_MZ
 * @orderAfter SRPG_RangeControl_MZ
 * @orderAfter SRPG_AoE_MZ
 * @orderAfter SRPG_PositionEffects_MZ
 * 
 * @param Target Formula
 * @desc 対象選択のデフォルト式。最も高い値が選択されます。
 * @default 1
 * 
 * @param Move Formula
 * @desc 移動先決定のデフォルト式。
 * @default nearestOpponent
 * 
 * @help
 * copyright 2020 SRPG Team. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 本プラグインは試験的に運用されています！
 *
 * SRPG_RangeControl_MZが必要になります。このプラグインをその下に配置してください。
 * SRPG_AoE_MZやSRPG_PositionEffects_MZを使用している場合、やはり本プラグインはそれら
 * の下に配置してください。
 *
 * AIにanyTargetおよびAoEスキルを使わせることが可能になり、敵やアクターごとの挙動
 * を設定することもできます。
 *
 * 本プラグイン内の式はある程度のJavaScriptの知識のある上級者が使用することを意図
 * しています。
 *
 * スキル用新タグ:
 * <aiIgnoreAiming>     aimingActorおよびaimingEventタグを無視します。
 * <aiIgnoreTgr>        狙われ率パラメータを無視します。
 * <aiFriendRate:X>     味方のターゲットスコアの係数。
 * <aiOpponentRate:X>   敵のターゲットスコアの係数。
 * <aiTarget: formula>  このスキル用のカスタムターゲット式。
 * <aiMove: formula>    このスキルが自分を対象とする場合のカスタム移動式。
 * 
 * アクター、職業、敵キャラ用新タグ：
 * <aiTarget: formula>  このユニットのデフォルトターゲット式。
 * <aiMove: formula>    このユニットのデフォルト移動式。
 *
 * イベント用新タグ:
 * <aiFlag:type>        AIのガイドに使用するフラグをイベントに付与します。
 *
 * アクター、職業、敵キャラ、武器、防具、スキル、ステート用新タグ:
 * <aiIgnore>           このユニットはAIユニットには完全に見えなくなります。
 *
 * ユニットの狙われ率を0に設定するのとは違い、<aiIgnore>は移動式において
 * <aimingEvent:X>と<aimingActor:X>タグ、またnearestFriend,
 * nearestOpponent, mostFriendsおよびmostOpponentsの値を無視します。
 *
 * 新しいスクリプト呼び出し：
 * event.setAiFlag('ABC')   changes the event's flag to ACB
 * event.clearAiFlag()      removes the event's flag
 *
 * ------------------------
 * ターゲット式
 * ------------------------
 *
 * スキル選択後、AIは射程内のすべての対象になりうるユニットをすべての取りうる位置から検証
 * し、最もターゲットスコアの高い対象を選択します。
 * スコアが0以下の対象は無視されます。
 *
 * ターゲットスコアはターゲット式の結果に狙われ率(tgr)をかけることで計算されます。
 * ユニットの狙われ率が0%の場合、そのユニットは味方からも敵からも無視されます。
 * <aiIgnoreTgr>を設定すると、そのスキルは狙われ率0を含めて狙われ率を無視するようになります。
 *
 * AoEスキルは範囲内のすべての対象のスコアを合算するので、より多くの対象にヒットする
 * この選択肢は選ばれやすいと言えます。
 *
 * スキルのメモに<aiFriendRate>または<aiOpponentRate>が設定されている場合、狙われ率に
 * さらに追加係数が適用されます。0に設定した場合AIはそれらのユニットの狙われ率が0であるかの
 * ように無視しますが、負の値を設定した場合その勢力をAoEに巻き込むことを能動的に避けるように
 * なります。より大きな負の値を設定すると、より一層味方を避けるようになります。
 * 2体の敵と1体の味方にヒットするAoEでは、敵A + 敵B - 味方Aのスコアになります。
 *
 * プラグインパラメータのデフォルト式に加え、職業、アクター、敵キャラにデフォルト式を
 * 追加したり、そのスキル特有の式を設定したりできます。
 *
 * <mode:aimingActor>あるいは<mode:aimingEvent>を設定した場合、指定した対象はそれが
 * 有効である限りすべての対象よりも優先されます。
 *
 * 以下の値がターゲット式にて使用可能です:
 * s[n]         スイッチn番の値
 * v[n]         変数n番の値
 * user         そのスキルの使用者
 * target       評価されているスキルの対象
 * a            (userと同じ)
 * b            (targetと同じ)
 * item         使用されているスキル
 * distance     目標地点までの距離
 * region       目標地点のリージョンID
 * terrain      目標地点の地形タグ
 * tag          (terrainと同じ)
 * damageFloor  目標地点がダメージ床なら1、そうでないなら0
 * range        目標地点から対象までの距離
 * front        対象が前からスキルを受けるとき1、それ以外は0
 * back         対象が後ろからスキルを受けるとき1、それ以外は0
 * side         対象が横からスキルを受けるとき1、それ以外は0
 *
 * 例：
 *
 * <aiTarget: 4 * a.atk - 2 * b.def> この場合デフォルトダメージ計算式にて最も高いダメージを
 * 与えられる対象を選択し、ダメージを与えられない対象は無視します。
 *
 * <aiTarget: a.hp - b.atk> 最も攻撃力の低い対象を選択し、使用者のHPを上回る攻撃力を持つ
 * 対象は無視します。
 *
 * <aiTarget: 1-b.hpRate()> 最も低いHP割合を持つ対象を選択し、無傷の対象は無視します。
 * 回復系スキルに最適です。
 *
 * <aiTarget: 1 + back> <aiFriendRate:-1> 背後から攻撃できる対象を選択しますが味方、
 * 特に背後からあたる味方は避けます。敵味方両方にあたるAoEに最適です。
 *
 * <aiTarget: range> 射程内で最も遠くの対象を選択します。
 *
 * ------------------------
 * 移動式
 * ------------------------
 *
 * AIが対象を取っているとき、最適な方に移動します。
 *
 * ただし行動を取っていないか対象が見つからない、あるいは自身が対象の場合、AIはどこに
 * 向かうべきかを決めるために移動式を使用します。
 *
 * AIは現在いる場所も含め移動範囲内のあらゆる誰も（何も）ない場所を判定し、最もスコアの
 * 高い（あるいはもっとも小さな負のスコアの）場所に移動します。複数の場所が同じスコアに
 * なった場合、最も近い場所を選択します。
 *
 * プラグインパラメータのデフォルト式に加え、職業、アクターおよび敵キャラにデフォルト式を
 * 追加できます。
 *
 * スキルに設定された移動式は、そのスキルが使用者自身を対象に取っている場合にのみ使用され
 * ます。たとえば回復しながら逃げる、防御しながら味方の集団まで移動する、などです。
 *
 * イベントに<mode:>タグが設定されている場合、そのユニットのデフォルト移動式を上書きします。
 * modeのリストについてはSRPG_coreを参照してください。
 *
 * 移動式には以下の値が使用可能です:
 * s[n]              スイッチn番の値
 * v[n]              変数n番の値
 * user              移動するユニット
 * a                 (userと同じ)
 * distance          移動した距離
 * region            目標地点のリージョンID
 * terrain           目標地点の地形タグ
 * tag               (terrainと同じ)
 * damageFloor       ダメージ床の場合1
 * nearestFriend     最も近い味方との距離（負）
 * nearestOpponent   最も近い敵との距離（負）
 * nearestUnitEvent  最も近いunitEventとの距離（負）
 * mostFriends       すべての味方との距離の合算（負）
 * mostOpponents     すべての敵との距離の合算（負）
 * nearestFlag['type']  最も近いtypeのフラグイベントとの距離
 * mostFlags['type']    すべてのtypeのフラグイベントとの距離の合算
 *
 * フラグとはメモに<aiFlag:type>が設定されたイベントで、アクター、敵キャラ、オブジェクト、
 * 戦闘には何の影響もないイベントを含むあらゆる種類のイベントのいずれでもかまいません。
 * 射手が待機すべき場所やハマりやすいので避けるべき地形など、AIユニットにマップに関する
 * 補足情報を与えるために使用することができます。フラグはイベントに設定するので、状況の
 * 変化を表現するためにマップ上を移動させたり消去したりすることもできます。
 *
 * 例：
 *
 * <aiMove: nearestOpponent> 最も近い敵ユニットに向かって移動します。
 *
 * <aiMove: nearestOpponent - damageFloor*2> 最も近い敵ユニットに向かいますが、
 * ダメージ床から2マス離れた場所で止まります。
 *
 * <aiMove: mostOpponents> 敵の最も大きな集団に向かって移動しますが、拡散しすぎている
 * 場合は多少迷います。
 *
 * <aiMove: a.hpRate() > 0.5 ? nearestOpponent : mostFriends> HPが50%以上であれば
 * 敵に近づきますが、それ以外の場合安全な場所に逃げます。
 *
 * <aiMove: region> 届く範囲の最も大きなIDのリージョンまで移動します。近くに現在地よりも
 * 大きなIDのリージョンが存在しない場合、その場で待機します。
 *
 * <aiMove: -region> 上記とほぼ同じですが、こちらは最も小さなIDのリージョンです。
 *
 * <aiMove: nearestFlag['protect']> 敵や戦闘には無関係な非表示イベントであったとしても、
 * 最も近くの<aiFlag:protect>がメモに記述されているイベントに向かって移動します。
 */

(function(){

	var parameters = PluginManager.parameters('SRPG_AIControl_MZ');
	var _targetFormula = parameters['Target Formula'] || '1';
	var _moveFormula = parameters['Move Formula'] || 'nearestOpponent';

	var coreParameters = PluginManager.parameters('SRPG_core_MZ');

//====================================================================
// Utility functions
//====================================================================

	// (utility) find the direction to a fixed point, discounting obstacles
	Game_Character.prototype.dirTo = function(x, y) {
		return $gameMap.dirBetween(this.posX(), this.posY(), x, y);
	};

	// (utility) find the direction from one point to another, discounting obstacles
	Game_Map.prototype.dirBetween = function(x1, y1, x2, y2) {
		var dir = 5;
		var dx = x1 - x2;
		var dy = y1 - y2;

		// account for looping maps
		if (this.isLoopHorizontal()) {
			if (dx > this.width() / 2) dx -= this.width();
			if (dx < -this.width() / 2) dx += this.width();
		}
		if (this.isLoopVertical()) {
			if (dy > this.height() / 2) dy -= this.height();
			if (dy < -this.height() / 2) dy += this.height();
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

		// account for looping maps
		if ($gameMap.isLoopHorizontal()) dx = Math.min(dx, $gameMap.width() - dx);
		if ($gameMap.isLoopVertical()) dy = Math.min(dy, $gameMap.height() - dy);
		
		return  dx + dy;
	};

//====================================================================
// Store target position for AI movement
//====================================================================

	// movement target
	Game_Temp.prototype.setAIPos = function(pos) {
		this._aiPos = pos;
	};
	Game_Temp.prototype.clearAIPos = function() {
		this._aiPos = null;
	};
	Game_Temp.prototype.AIPos = function() {
		return this._aiPos || null;
	};

	// cell target (AoE, etc)
	Game_Temp.prototype.setAITargetPos = function(pos) {
		this._aiTargetPos = pos;
	};
	Game_Temp.prototype.clearAITargetPos = function() {
		this._aiTargetPos = null;
	};
	Game_Temp.prototype.AITargetPos = function() {
		return this._aiTargetPos || null;
	};

//====================================================================
// New decision-making functions
//====================================================================

	// enemy commands
	Scene_Map.prototype.srpgInvokeEnemyCommand = function() {
		// select unit
		if (!this.srpgGetAIUnit('enemy')) {
			$gameSystem.srpgTurnEnd();
			return;
		}

		// select action
		if (this.srpgAICommand()) {
			$gameTemp.setAutoMoveDestinationValid(true);
			$gameTemp.setAutoMoveDestination($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY());
			$gameSystem.setSubBattlePhase('enemy_move');
		} else {
			this.srpgAfterAction();
		}
	};

	// auto-actor command
	Scene_Map.prototype.srpgInvokeAutoActorCommand = function() {
		// select unit
		if (!this.srpgGetAIUnit('actor')) {
			$gameSystem.srpgStartEnemyTurn();
			return;
		}
		// select action
		if (this.srpgAICommand()) {
			$gameTemp.setAutoMoveDestinationValid(true);
			$gameTemp.setAutoMoveDestination($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY());
			$gameSystem.setSubBattlePhase('auto_actor_move');
		} else {
			this.srpgAfterAction();
		}
	};

	// enemy movement
	// modified by OhisamaCraft
	Scene_Map.prototype.srpgInvokeEnemyMove = function() {
		if (!$gamePlayer.isStopping()) return;

		// path to destination
		var pos = $gameTemp.AIPos();
		if (pos) {
			var enemy = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
			var route = $gameTemp.MoveTable(pos.x, pos.y)[1];
			$gameSystem.setSrpgWaitMoving(true);
			$gameTemp.activeEvent().srpgMoveRouteForce(route);
			enemy.setMovedStep(route.length - 1);
		}
		$gameSystem.setSubBattlePhase('enemy_action');
	};

	// auto-actor movement
	// modified by OhisamaCraft
	Scene_Map.prototype.srpgInvokeAutoActorMove = function() {
		if (!$gamePlayer.isStopping()) return;

		// path to destination
		var pos = $gameTemp.AIPos();
		if (pos) {
			var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
			var route = $gameTemp.MoveTable(pos.x, pos.y)[1];
			if (route) {
				$gameSystem.setSrpgWaitMoving(true);
				$gameTemp.activeEvent().srpgMoveRouteForce(route);
				actor.setMovedStep(route.length - 1);
			}
		}
		$gameSystem.setSubBattlePhase('auto_actor_action');
	};

	// standardize the APIs for choosing actions
	Game_Actor.prototype.makeSrpgActions = function() {
		this.makeActions();
		if (this.isConfused()) {
			this.makeConfusionActions();
		}
	};


	// handle cell targeting
	var _srpgInvokeAutoUnitAction = Scene_Map.prototype.srpgInvokeAutoUnitAction;
	Scene_Map.prototype.srpgInvokeAutoUnitAction = function() {
		// set up AoE around the target position
		var pos = $gameTemp.AITargetPos();
		if (pos) {
			$gameTemp.showArea(pos.x, pos.y);
		}

		// invoke the skill as normal
		_srpgInvokeAutoUnitAction.call(this);

		// correctly move the cursor to target position
		if (pos) {
			$gameTemp.setAutoMoveDestinationValid(true);
			$gameTemp.setAutoMoveDestination(pos.x, pos.y);
		}

		// clear the target position, just to be sure
		$gameTemp.clearAITargetPos();
	};

//====================================================================
// Primary AI logic
//====================================================================

	// find an AI unit
	Scene_Map.prototype.srpgGetAIUnit = function(type) {
		var selection = null;
		$gameMap.events().some(function (event) {
			if (event && !event.isErased() && event.isType() === type) {
				var unit = $gameSystem.EventToUnit(event.eventId())[1];
				if (unit && unit.canMove() && !unit.srpgTurnEnd()) {
					selection = event;
					return true;
				}
			}
			return false;
		});

		if (!selection) return false;
		$gameTemp.setActiveEvent(selection);
		return true;
	};

	// decide a unit's action, target, and movement
	// modified by OhisamaCraft
	Scene_Map.prototype.srpgAICommand = function() {
		var event = $gameTemp.activeEvent();
		var type = $gameSystem.EventToUnit(event.eventId())[0];
		var user = $gameSystem.EventToUnit(event.eventId())[1];
		if (!event || !user) return false;

		// choose action and target
		var target = null;
		$gameTemp.setSrpgMoveTileInvisible(true);
		while (true) { // dangerous! limit loops to # of skills the user has?
			user.makeSrpgActions();
			$gameSystem.srpgMakeMoveTable(event);
			// simple AI との競合回避（skillのみ再設定する）
			if (user.currentAction().item()) {
				var targetType = this.makeTargetType(user, type);
				var canAttackTargets = this.srpgMakeCanAttackTargets(user, targetType); 
				this.checkAlternativeSkill(event, type, user, targetType, canAttackTargets);	
			}
			$gameTemp.clearAIPos();
			$gameTemp.clearAITargetPos();
			target = this.srpgAITarget(user, event, user.action(0));

			var item = user.currentAction().item();
			if (target || !item || $gameTemp.noTarget(item.id)) break;
			$gameTemp.setNoTarget(item.id);
		}
		$gameTemp.clearNoTarget();
		$gameTemp.setSrpgMoveTileInvisible(false);

		// standing units skip their turn entirely
		var user = $gameSystem.EventToUnit(event.eventId())[1];
		if (user.battleMode() === 'stand') {
			if (user.hpRate() < 1.0 || (target && target.isType() != event.isType())) {
				user.setBattleMode('normal');
			} else {
				$gameTemp.clearMoveTable();
				user.onAllActionsEnd();
				return false;
			}
		}

		// decide movement, if not decided by target
		if (!$gameTemp.AIPos()) {
			this.srpgAIPosition(user, event, user.action(0));
		}

		return true;
	};

//====================================================================
// Don't select skills we know have no targets
//====================================================================

	// initialize the no-target table
	var _Game_Temp_initialize = Game_Temp.prototype.initialize;
	Game_Temp.prototype.initialize = function() {
		_Game_Temp_initialize.call(this);
		this.clearNoTarget();
	};

	// check if the skill had no targets before
	Game_Temp.prototype.noTarget = function(skillId) {
		return (skillId > 0 && !!this._noTargetList[skillId]);
	};

	// track that this skill had no targets
	Game_Temp.prototype.setNoTarget = function(skillId) {
		if (skillId > 0) this._noTargetList[skillId] = true;
	};

	// clear the list of skills with no target
	Game_Temp.prototype.clearNoTarget = function() {
		this._noTargetList = [];
	};

	// we've already confirmed there are no valid targets for this skill
	var _canUse = Game_BattlerBase.prototype.canUse;
	Game_BattlerBase.prototype.canUse = function(item) {
		if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== "actor_phase" &&
		DataManager.isSkill(item) && $gameTemp.noTarget(item.id)) {
			return false;
		}
		return _canUse.call(this, item);
	}

//====================================================================
// Target-finding
//====================================================================

	// new AI knows how to use AoEs, even with holes
	Game_System.prototype.srpgAIUnderstandsAoE = true;

	// decide what target to go after
	Scene_Map.prototype.srpgAITarget = function(user, event, action) {

		// no action, no target
		if (!user || !event || !action || !action.item()) return null;

		// track whether this is an AoE effect or not
		const isAoE = (action.area && action.area() > 0);

		// skills that can only affect yourself
		if (user.srpgSkillRange(action.item()) <= 0 && !isAoE) {
			if (action.isForFriend()) {
				$gameTemp.setTargetEvent(event);
				if (action.item().meta.notUseAfterMove) { // can't move, set the position
					$gameTemp.setAIPos({x: event.posX(), y: event.posY()});
				}
				return event;
			}
			return null;
		}

		// notetag to ignore priority targets
		if (action.item().meta.aiIgnoreAiming || user.confusionLevel() > 0) {
			$gameTemp.setSrpgPriorityTarget(null);
		} else {
			this.srpgPriorityTarget(user);
		}

		var bestScore = 0;
		var bestPriority = false;
		var bestTarget = null;
		var bestTargetPos = null;
		var bestPos = null;

		if (!isAoE) { // targeting a single unit
			$gameMap.events().forEach(function(target) {
				if (!target) return;

				var posList = $gameTemp.RangeMoveTable(target.posX(), target.posY());
				for (var i = 0; i < posList.length; i++) {
					var pos = posList[i];
					var priority = false;
					var score = target.targetScore(user, action, pos);

					// check priority target
					if (score >= 0 && $gameTemp.isSrpgPriorityTarget() == target) {
						priority = true;
					}

					// pick the best target
					if ((priority && !bestPriority) || (score > bestScore && priority == bestPriority)) {
						bestScore = score;
						bestPriority = priority;
						bestTarget = target;
						bestPos = pos;
					}
				}
			});
		} else { // targeting an AoE effect
			$gameTemp.moveList().forEach(function (targetPos) {
				if (!targetPos) return;
				var x = targetPos[0];
				var y = targetPos[1];

				var posList = $gameTemp.RangeMoveTable(x, y);
				for (var i = 0; i < posList.length; i++) {
					var pos = posList[i];
					var r = action.area();
					var mr = action.minArea();
					var t = $gameTemp.correctShape(user, action.areaType());
					var d = $gameMap.dirBetween(pos.x, pos.y, x, y);
					var priority = false;

					var score = $gameMap.events().reduce(function(value, target) {
						if (target && target != event && target.inArea(x, y, r, mr, t, d)) {
							var bonus = target.targetScore(user, action, pos);
							if (!isNaN(bonus)) {
								value += bonus;
								if (bonus > 0 && target == $gameTemp.isSrpgPriorityTarget()) {
									priority = true;
								}
							}
						}
						return value;
					}, 0);

					// check if the user is in the AoE
					if ($gameMap.inArea(pos.x - x, pos.y - y, r, mr, t, d)) {
						var bonus = event.targetScore(user, action, pos);
						if (!isNaN(bonus)) {
							score += bonus;
						}
					}

					// pick the best target position
					if ((priority && !bestPriority) || (score > bestScore && priority == bestPriority)) {
						bestScore = score;
						bestPriority = priority;
						bestTargetPos = {x: targetPos[0], y: targetPos[1], dir: d};
						bestPos = pos;
					}
				}
			});
		}

		// set up AoE targets
		if (bestTargetPos) {
			$gameTemp.showArea(bestTargetPos.x, bestTargetPos.y, bestTargetPos.dir);
			$gameTemp.setAITargetPos(bestTargetPos);
			$gameTemp.selectArea(user, action);
			if ($gameTemp.areaTargets().length > 0) {
				bestTarget = $gameTemp.areaTargets().shift().event;
			}
			$gameTemp.clearArea();
		}
		// set the optimal target and position
		$gameTemp.setTargetEvent(bestTarget);
		if (bestTarget != event || isAoE || action.item().meta.notUseAfterMove) {
			$gameTemp.setAIPos(bestPos);
		} else {
			$gameTemp.clearAIPos(); // self-target can go wherever
		}
		return bestTarget;
	};

	// get the unit's target score
	Game_CharacterBase.prototype.targetScore = function(user, action, pos) {
		if (this.isErased()) return 0;
		var targetAry = $gameSystem.EventToUnit(this.eventId());
		if (!targetAry) return 0;
		var target = targetAry[1];

		// ignored by other AI
		if (target.priorityTag('aiIgnore') && target != user) return 0;

		// initial scoring
		var score = target.tgr;
		if (action.item().meta.aiIgnoreAiming) score = 1;

		// invalid or avoided targets
		if (user.confusionLevel() != 2) {
			if ((target.isActor() == user.isActor()) == (user.confusionLevel() < 3)) {
				if (!action.isForFriend()) score = 0;
				else score *= action.aiFriendRate();
			} else {
				if (!action.isForOpponent()) score = 0;
				else score *= action.aiOpponentRate();
			}
		}

		// it's already 0, it can't be anything else
		if (score == 0) return 0;

		// stats and switches
		var s = $gameSwitches._data;
		var v = $gameVariables._data;
		var a = user;
		var b = target;
		var item = action.item();

		// TODO: Figure out what needs to be set up for the prediction to work
		//var value = Math.abs(Math.max(b.hp-b.mhp, action.srpgPredictionDamage(b)));

		// positional values
		var _x = pos.x;
		var _y = pos.y;
		var _d = (target != user) ? this.dirTo(_x, _y) : this.direction();

		var range = (target != user) ? this.distTo(_x, _y) : 0;
		var distance = $gameTemp.MoveTable(_x, _y)[1].length - 1;
		var front = this.direction() == _d ? 1 : 0;
		var back = this.direction() == 10-_d ? 1 : 0;
		var side = (!front && !back) ? 1 : 0;
		var damageFloor = $gameMap.isDamageFloor(_x, _y) ? 1 : 0;
		var region = $gameMap.regionId(_x, _y) || 0;
		var terrain = $gameMap.terrainTag(_x, _y) || 0;
		var tag = terrain;

		// apply the formula
		if (item.meta.aiTarget) {
			score *= eval(item.meta.aiTarget);
		} else if (user.isActor() && user.currentClass().meta.aiTarget) {
			score *= eval(user.currentClass().meta.aiTarget);
		} else if (user.isActor() && user.actor().meta.aiTarget) {
			score *= eval(user.actor().meta.aiTarget);
		} else if (user.isEnemy() && user.enemy().meta.aiTarget) {
			score *= eval(user.enemy().meta.aiTarget);
		} else {
			score *= eval(_targetFormula);
		}
		return Number(score);
	};

	// Check if the AI should avoid targeting friends
	Game_Action.prototype.aiFriendRate = function() {
		if (!this.item() || !this.item().meta.aiFriendRate) return 1;
		else return Number(this.item().meta.aiFriendRate);
	};
	// Check if the AI should avoid targeting opponents
	Game_Action.prototype.aiOpponentRate = function() {
		if (!this.item() || !this.item().meta.aiOpponentRate) return 1;
		else return Number(this.item().meta.aiOpponentRate);
	};


//====================================================================
// Position-finding
//====================================================================

	// find the optimal position without a target
	Scene_Map.prototype.srpgAIPosition = function(user, event, action) {
		var bestX = event.posX();
		var bestY = event.posY();
		var bestScore = event.positionScore(event.posX(), event.posY(), user, action);

		// ignore priority targets
		if (user.confusionLevel() > 0) {
			$gameTemp.setSrpgPriorityTarget(null);
		} else {
			this.srpgPriorityTarget(user);
		}

		$gameTemp.moveList().forEach(function (pos) {
			if (pos[2] == 1) return; // ignore range entries if found
			var x = pos[0];
			var y = pos[1];
			var score = event.positionScore(x, y, user, action);

			if (score > bestScore) {
				bestX = x;
				bestY = y;
				bestScore = score;
			}
		});
		$gameTemp.setAIPos({x: bestX, y: bestY});
	};

	// determine the strategic value of a position on the map
	Game_CharacterBase.prototype.positionScore = function(x, y, user, action) {
		var event = this;
		var _confusion = user.confusionLevel();

		var _maxDist = 1 + $gameMap.width() + $gameMap.height();
		var nearestFriend = -_maxDist;
		var nearestOpponent = -_maxDist;
		var nearestUnitEvent = -_maxDist;
		var nearestFlag = {};
		var mostFriends = 0;
		var mostOpponents = 0;
		var mostFlags = {};

		// find nearby units
		var occupied = $gameMap.events().some(function(otherEvent) {
			if (otherEvent !== event && !otherEvent.isErased()) {
				// ignore occupied spaces
				if (otherEvent.pos(x, y) && ['enemy', 'actor', 'playerEvent'].contains(otherEvent.isType())) {
					return true;
				}

				// ignored units
				var unitAry = $gameSystem.EventToUnit(otherEvent.eventId());
				if (unitAry && unitAry[1] && unitAry[1].priorityTag('aiIgnore')) return false;

				// track distance to nearest units
				var dist = -otherEvent.distTo(x, y);
				if (otherEvent.isType() == event.isType()) {
					if (_confusion < 3) {
						nearestFriend = Math.max(dist, nearestFriend);
						mostFriends += dist;
					}
					if (_confusion > 1) {
						nearestOpponent = Math.max(dist, nearestOpponent);
						mostOpponents += dist;
					}
				} else if (['enemy', 'actor'].contains(otherEvent.isType())) {
					if (_confusion < 3) {
						nearestOpponent = Math.max(dist, nearestOpponent);
						mostOpponents += dist;
					}
					if (_confusion > 1) {
						nearestFriend = Math.max(dist, nearestFriend);
						mostFriends += dist;
					}
				} else if (otherEvent.isType() === 'unitEvent') {
					nearestUnitEvent = Math.max(dist, nearestUnitEvent);
				}

				// track distance to arbitrary "flag" events
				var type = otherEvent.aiFlag();
				if (type) {
					if (nearestFlag[type] === undefined) nearestFlag[type] = -_maxDist;
					nearestFlag[type] = Math.max(dist, nearestFlag[type]);
					mostFlags[type] += dist;
				}
			}
			return false;
		});
		if (occupied) return Number.NEGATIVE_INFINITY;

		// general info
		var s = $gameSwitches._data;
		var v = $gameVariables._data;
		var a = user;
		var distance = $gameTemp.MoveTable(x, y)[1].length - 1;
		var damageFloor = $gameMap.isDamageFloor(x, y) ? 1 : 0;
		var region = $gameMap.regionId(x, y) || 0;
		var terrain = $gameMap.terrainTag(x, y) || 0;
		var tag = terrain;

		// self-target skill move formula
		if (this == $gameTemp.targetEvent() && action.item() && action.item().meta.aiMove) {
			return eval(action.item().meta.aiMove);
		}

		// standard AI modes (TODO: This still needs some work?)
		if (user.battleMode() === 'stand') {
			return 0; // no movement
		} else if (user.battleMode() === 'regionUp' || user.battleMode() === 'absRegionUp') {
			return region; // higher region
		} else if (user.battleMode() === 'regionDown' || user.battleMode() === 'absRegionDown') {
			return -region; // lower region
		} else if (user.battleMode() === 'aimingEvent' || user.battleMode() === 'aimingActor') {
			// priority target
			if ($gameTemp.isSrpgPriorityTarget() && !$gameTemp.isSrpgPriorityTarget().isErased()) {
				var priorityUnit = $gameSystem.EventToUnit($gameTemp.isSrpgPriorityTarget().eventId());
				if (!priorityUnit || !priorityUnit[1].priorityTag('aiIgnore')) {
					return -$gameTemp.isSrpgPriorityTarget().distTo(x, y);
				}
			}
		}

		// formulas coming from actor / class / enemy
		if (user.isActor() && user.currentClass().meta.aiMove) {
			return eval(user.currentClass().meta.aiMove);
		} else if (user.isActor() && user.actor().meta.aiMove) {
			return eval(user.actor().meta.aiMove);
		} else if (user.isEnemy() && user.enemy().meta.aiMove) {
			return eval(user.enemy().meta.aiMove);
		}

		// default formula
		return eval(_moveFormula);
	};

//====================================================================
// Event flags
//====================================================================

	// track the event's flag
	Game_Event.prototype.setAiFlag = function(type) {
		this._aiFlag = type;
	};
	Game_Event.prototype.clearAiFlag = function() {
		this._aiFlag = null;
	};
	Game_Event.prototype.aiFlag = function() {
		return this._aiFlag;
	};

	// set up default flags from events
	var _setAllEventType = Game_System.prototype.setAllEventType;
	Game_System.prototype.setAllEventType = function() {
		_setAllEventType.call(this);
		$gameMap.events().forEach(function(event) {
			if (event.event().meta.aiFlag) {
				event.setAiFlag(event.event().meta.aiFlag);
			} else {
				event.clearAiFlag();
			}
		});
	};

})();
