//=============================================================================
// SRPG_MoveMethod_MZ.js
// Copyright (c) 2020 Shoukang. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------
// Free to use and edit    version 1.04 fix unclaimed variable and fastern isOccupied function
//=============================================================================
/*:
 * @target MZ
 * @plugindesc More move modes and improved pathfinding that can handle all conditions! , edited by OhisamaCraft. Need SRPG_AIControl_MZ.
 * @author Shoukang
 * @base SRPG_core_MZ
 * @base SRPG_RangeControl_MZ
 * @base SRPG_AIControl_MZ
 * @orderAfter SRPG_core_MZ
 * @orderAfter SRPG_RangeControl_MZ
 * @orderAfter SRPG_AIControl_MZ
 *
 * @param search range
 * @desc How many move points pathfinding AI can consume before stop, set low to to avoid lag spikes.
 * @type number
 * @min 10
 * @default 40
 *
 * @param confusion move rate
 * @desc confusion move(random move) probability = (0.1 * thisParameter * confusionLevel). Set 0 to disable.
 * @type number
 * @max 10
 * @default 3
 *
 * @param enable fall back
 * @desc Ture: If target position not reachable, go to the nearest position. False: stay still.
 * @type boolean
 * @default true
 *
 * @help
 * copyright 2020 Shoukang. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * This plugin provides more move modes, improved pathfinding that can find the route in all conditions(it grabs data directly from movetable),
 * and easy way to make extensions.
 * It supports all move modes from SRPG_Core and provides new ones.
 * However, if you use <aiMove:xxx> tag, you will need to rewrite them to fit this plugin. Because this plugin no longer use score
 * system to find the best position. Instead, it allows you to set move mode in different conditions. See 'aiMove tags' for detail.
 * This plugin doesn't change anything of target formula, you can use them as usual.
 * This plugin won't support  <movementAI:xxx> tag from SRPG_pathfinding. Actually, this plugin is not compatible with SRPG_pathfinding.
 * Don't worry, I believe the new system is more powerful, especially for coders!
 * =============================================================================================================================
 * event note tags for move mode(same as Core plugin):
 *   <mode:normal>         # (if you don't set mode, set 'normal' automatically). The default 'normal' mode can be set at SRPG_AIControl.
 *   <mode:stand>          # stand if enemy don't near by.
 *   <mode:regionUp>       # go to bigger region ID if enemy isn't near by.
 *   <mode:regionDown>     # go to smaller region ID if enemy isn't near by.
 *   <mode:absRegionUp>    # always go to bigger region ID, regardless of nearby enemy.
 *   <mode:absRegionDown>  # always go to smaller region ID, regardless of nearby enemy.
 *   <mode:aimingEvent>    # aim for event with the specified ID (use this note with <targetId:X>).
 *   <mode:aimingActor>    # aim for actor with the specified ID (use this note with <targetId:X>).
 *   <targetId:x>          # ID of target event or actor.
 * =============================================================================================================================
 * New event note tags for move mode (some of them are based on SRPG_AIControl's move formulas):
 *   <mode:random>         # move randomly.
 *   <mode:region x>       # move to nearest tile with region x.
 *   <mode:position x y>   # move to map position [x, y].   
 *   <mode:absPosition x y># with abs: regardless of nearbt enemies.
 *   <mode:nearestFriend>  # move to the nearest friend.
 *   <mode:nearestOpponent># move to the nearest opponent.
 *   <mode:nearestUnitEvent> # move to the nearest unit event.
 *   <mode:mostFriends>    # move to the 'center' of friend units.
 *   <mode:mostOpponents>  # move to the 'center' of friend units.
 *   <mode:avoidOpponents> # move away from the opponents, the distance is mesuared by direct distance, not route distance.
 *   <mode:absAvoidOpponents>  # with abs: regardless of nearby enemies.
 *   <mode:avoidFlags['type']> # move away from the events with <aiFlag:type>, or events with this type(object, enemy, unitevent, etc.). The distance is direct distance.
 *   <mode:absAvoidFlags['type']> # with abs: regardless of nearby enemies.
 *   <mode:nearestFlag['type']># move to the nearest event with <aiFlag:type>, or event with this type(object, enemy, unitevent, etc.).
 *   <mode:mostFlags['type']>  # move to the 'center' of events with <aiFlag:type>, or events with this type(object, enemy, unitevent, etc.).
 *                             # You can add more than one type, for example: <mode:nearestFlag['customizedType', 'unitevent', 'actor']>
 * 1/3/2022 Update: any mode contains keyword 'abs' will ignore nearby enemies
 * =============================================================================================================================
 * event/class/actor/enemy note tags for aiMove:
 * The aiMove note tags allow you to set different move mode based on condition, it will be checked before move to refresh move mode.
 * Priority: event > class > actor/enemy notetags. and aiMove tag priority > event note tags for move mode.
 * The tag will look like <aiMove:'regionUp'>. the content after ':' will be PROCESSED AS CODE. So add '' if it's a string(move mode).
 * The code should finally give a move mode string (It's no longer calculating the score for each tile in the movelist!),
 * or a string that can be recognized by aiMoveExtension function.(see below)
 * However, if you use it as the above example it makes no difference with <mode:xxx> tags, except that you can use it on actor/class....
 * The correct way to use:
 * <aiMove:0.8 < a.hpRate() ? 'nearestOpponent' : 'mostFriends'> mode is nearestOpponent when hprate > 0.8, else mode is mostFriends.
 * Important: don't compare with ">", it will be considered as the bracket! Always use '<' to compare.
 * If you want to build more complicated move methods, go to the definition of 'aiMoveExtension' function and see my examples: 
 * 'patrolRegion x y', 'timid'. With some JS knowledge, you can build the method yourself.
 * Note: if you want to write flag['xxx'] for aiMove, write like this: <aiMove:"nearestFlag['type1', 'type2',...]">
 * =============================================================================================================================
 * event/class/actor/enemy note tags:
 *   <avoidDamageFloor:xxx>      # avoid damagefloor, replace xxx with true or false. Priority is the same as aiMove tags.
 *   <aiMove:'escape'>           # regardless of nearby enemy, move to most friends. See 'isSkipAttackMode' for detail.
 *   <aiMove:'timid'>            # mode is 'nearestOpponent' when hprate > 0.8, else mode is 'escape'
 *   <aiMove:'patrolRegion x y'> # if unit is at region x, mode becomes 'region y'. If unit is at region y, mode becomes 'region x'.
 *   <aiMove:'keepDist x'>       # function is absAvoidOpponents only when it can keep distance above x, or mode will be 'nearestOpponent'.
 * =============================================================================================================================
 * SkipAttackModes:
 * With this plugin, before a unit search for targets, it will first check if the mode needs to skip target searching(attack) and use move mode. 
 * For example if the mode is 'absRegionUp', the unit will ignore nearby enemies and move to a higher region.
 * The 'escape' mode will also skip the target searching, then the 'escape' mode will become 'mostFriends'.
 * See 'isSkipAttackMode' function for detail, and you can extend it for more skip attack mode. These modes only work with 'aiMove' tags,
 * unless you also check them in 'battleModeExtension' function.
 * =============================================================================================================================
 * Notes for advanced user:
 * This plugin builds several useful route searching functions that you can use to build a move methods. Their use is described around the definition.
 * All reachable positions's distance should grab from movetable, if not reachable, the distance is _maxMove + $gameMap.distTo(...),
 * so that reachable positions are always shorter than unreachable ones.
 * To extend more modes, use 'battleModeExtension' function.
 * =============================================================================================================================
 * version 1.04 fix unclaimed variable and fastern isOccupied function
 * version 1.03 fix partol region bug
 * version 1.02 improved clustering algorithm for mostXXX move method
 * version 1.01 add new 'avoid' mode and 'keepdistance' aiMove
 * version 1.00 first release!
 * =============================================================================================================================
 * Compatibility:
 * Need SRPG_RangeControl, SRPG_AIControl, and place this plugin below them.
 * =============================================================================================================================
 */

/*:ja
 * @target MZ
 * @plugindesc 移動モードを追加し、あらゆる条件を考慮するように経路探索を改善します（おひさまクラフトによる改変）。SRPG_AIControl_MZが必要です。
 * @author Shoukang
 * @base SRPG_core_MZ
 * @base SRPG_RangeControl_MZ
 * @base SRPG_AIControl_MZ
 * @orderAfter SRPG_core_MZ
 * @orderAfter SRPG_RangeControl_MZ
 * @orderAfter SRPG_AIControl_MZ
 *
 * @param search range
 * @desc AIが経路探索を終了する前に消費する移動ポイントの数。ラグを回避するためには、低い値に設定してください。
 * @type number
 * @min 10
 * @default 40
 *
 * @param confusion move rate
 * @desc 混乱時のランダム移動係数。(0.1 * このパラメータの値 * 混乱レベル)　無効にする場合は0にしてください。
 * @type number
 * @max 10
 * @default 3
 *
 * @param enable fall back
 * @desc trueの場合：対象の位置まで届かない場合、最も近い場所に移動します。falseの場合：その場で停止します。
 * @type boolean
 * @default true
 *
 * @help
 * copyright 2020 Shoukang. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 本プラグインは移動モードを追加し、あらゆる条件を考慮して経路探索を行うように改善し（移動テーブルから直接データを取得）、
 * 拡張を容易にします。
 * SRPG_Coreのすべての移動モードをサポートし、新たなモードを追加します。
 * ただし<aiMove:xxx>タグを使用している場合、本プラグインに合わせるために編集が必要になります。本プラグインを導入すると、
 * 最適位置を発見するためのスコア評価システムは使用されなくなるためです。代わって、別の条件で移動モードを設定できるようになります。
 * 詳細は「aiMoveタグ」をご覧ください。
 * 本プラグインはターゲット式にいかなる変更も加えないため、通常通りお使いいただけます。
 * 本プラグインはSRPG_pathfindingをサポートしていないため、<movementAI:xxx>タグの使用についてもサポートしていません。
 * 特にエンジニアにとっては、本プラグインが提供する新しいシステムの方がよりパワフルのはずですのでご心配には及びません！
 * =============================================================================================================================
 * 移動モード設定用の、イベントのメモタグ（SRPG_coreプラグインと同じ）:
 *   <mode:normal>         # （モードを設定していない場合、自動的に「normal」になります。）デフォルトの「normal」モードはSRPG_AIControlにて設定できます。
 *   <mode:stand>          # 敵が近くにいない場合、静止します。
 *   <mode:regionUp>       # 敵が近くにいない場合、より大きなリージョンIDまで移動します。
 *   <mode:regionDown>     # 敵が近くにいない場合、より小さなリージョンIDまで移動します。
 *   <mode:absRegionUp>    # 近くに敵がいるかにかかわらず、常により大きなリージョンIDまで移動します。
 *   <mode:absRegionDown>  # 近くに敵がいるかにかかわらず、常により小さなリージョンIDまで移動します。
 *   <mode:aimingEvent>    # 指定したIDを持つイベントを狙います（<targetId:X>と共に使用してください）。
 *   <mode:aimingActor>    # 指定したIDを持つアクターを狙います（<targetId:X>と共に使用してください）。
 *   <targetId:x>          # ターゲットイベントもしくはアクターのID。
 * =============================================================================================================================
 * 移動モード設定用の新しいメモタグ（いくつかはSRPG_AIControlの移動式に基づきます）:
 *   <mode:random>         # ランダムに移動します。
 *   <mode:region x>       # リージョンＸが設定されている最も近くのタイルまで移動します。
 *   <mode:position x y>   # マップ座標[x, y]まで移動します。   
 *   <mode:absPosition x y># 上記とほぼ同じですが、最も近くにいる敵を無視します。
 *   <mode:nearestFriend>  # 最も近くにいる味方まで移動します。
 *   <mode:nearestOpponent># 最も近くにいる敵まで移動します。
 *   <mode:nearestUnitEvent> # 最も近くにあるユニットイベントまで移動します。
 *   <mode:mostFriends>    # 味方ユニット集団の「中心」まで移動します。
 *   <mode:mostOpponents>  # 敵ユニット集団の「中心」まで移動します。
 *   <mode:avoidOpponents> # 敵から離れます。距離は直線距離であり、移動ルート距離ではありません。
 *   <mode:absAvoidOpponents>  # 上記とほぼ同じですが、最も近くにいる敵を無視します。
 *   <mode:avoidFlags['type']> # <aiFlag:type>タグを持つイベントまたはこのtype（object、enemy、unitevent等）を持つイベントから離れます。距離は直線距離です。
 *   <mode:absAvoidFlags['type']> # 上記とほぼ同じですが、最も近くにいる敵を無視します。
 *   <mode:nearestFlag['type']># <aiFlag:type>タグを持つイベントまたはこのtype（object、enemy、unitevent等）を持つイベントに近づきます。
 *   <mode:mostFlags['type']>  # <aiFlag:type>タグを持つイベント集団またはこのtype（object、enemy、unitevent等）を持つイベント集団の中心に近づきます。
 *                             # これらは複数のtypeを設定できます。例：<mode:nearestFlag['customizedType', 'unitevent', 'actor']>
 * 1/3/2022 更新: 上記以外でもタグに「abs」というキーワードが入っていれば、常に最も近くにいる敵を無視するようになりました。
 * =============================================================================================================================
 * aiMoveに関するイベント/職業/アクター/敵キャラ用メモタグ:
 * aiMoveメモタグを使用することで、条件に応じた別々の移動モードを設定することができるようになります。移動モードを更新するために、移動前に判定されます。
 * 優先度: イベント > 職業 > アクター/敵キャラ メモタグ。また、aiMoveタグの方がイベントメモタグよりも移動モードにおいては優先されます。
 * 実際に設定する場合、<aiMove:'regionUp'>のように入力します。「:」の右側はコードとして処理されるため、文字列を指定する場合は''で囲ってください。
 * このコードには、最終的に（戻り値として）移動モードを表す文字列、あるいはaiMoveExtension関数（詳細は下記）によって認識されうる文字列になるようにします。
 * （移動リスト内のタイルごとのスコアを計算する必要はもはやありません！）
 * ただし上記例をそのまま使う場合、アクターや職業に使えるということ以外は<mode:xxx>タグと変わりません。
 * 有効活用例：
 * <aiMove:0.8 < a.hpRate() ? 'nearestOpponent' : 'mostFriends'> modeは[hprate > 0.8]の場合nearestOpponentになり、それ以外はmostFriendsになります。
 * 重要：メモタグのカッコと解釈されてしまうため、「>」を使用しないでください！数値比較をする場合、必ず「<」を使用してください。
 * より複雑な移動メソッドを設定したい場合、「aiMoveExtension」定義箇所にある例をご覧ください： 
 * 「patrolRegion x y」や「timid」などです。JavaScriptの知識があれば、あなた自身でメソッドを構築できるでしょう。
 * 注：aiMove用にflag['xxx']を使用する場合、次のように記述してください：<aiMove:"nearestFlag['type1', 'type2',...]">
 * =============================================================================================================================
 * イベント/職業/アクター/敵キャラメモタグ:
 *   <avoidDamageFloor:xxx>      # ダメージ床を回避します。xxxはtrueかfalseに置き換えてください。優先度はaiMoveタグと同じです。
 *   <aiMove:'escape'>           # 近くにいる敵を無視して最も人数が多い味方集団まで移動します。詳細は「isSkipAttackMode」をご覧ください。
 *   <aiMove:'timid'>            # [hprate > 0.8]の場合モードは「nearestOpponent」になり、それ以外の場合「escape」になります。
 *   <aiMove:'patrolRegion x y'> # ユニットがリージョンxにいる場合、モードは「region y」になります。ユニットがリージョンyにいる場合、モードは「region x」になります。
 *   <aiMove:'keepDist x'>       # xから距離を確保できる場合モードは「absAvoidOpponents」になり、それ以外の場合モードは「nearestOpponent」になります。
 * =============================================================================================================================
 * 攻撃スキップモード:
 * 本プラグインを使用することで、ユニットのターゲットサーチ前にモードがターゲットサーチ（攻撃）をスキップする必要があるかをまず判定するようになります。 
 * 例えばモードが「absRegionUp」の場合、そのユニットは近くの敵を無視してより大きなIDのリージョンまで移動します。
 * 「escape」モードもターゲットサーチをスキップするようになり、その後「escape」モードは「mostFriends」になります。
 * 詳細は「isSkipAttackMode」関数をご覧ください。それ以外の攻撃スキップモードをあなた自身が拡張することもできます。これらのモードは「aiMove」で使用する場合のみ機能します
 * （ただし「battleModeExtension」関数に組み込んだ場合を除く）。
 * =============================================================================================================================
 * 上級者向け:
 * 本プラグインには便利なルート探索関数が複数用意されており、それらを使用してあなた自身が移動メソッドを構築することもできます。使用方法は定義箇所の付近に記述されています。
 * すべての到達可能な位置までの距離は移動テーブルから取得されますが、到達不可能な場合その距離は_maxMove + $gameMap.distTo(...)になります。
 * 到達可能位置が常に到達不可能位置よりも距離が短くなるようにするためです。
 * モードを拡張する場合、「battleModeExtension」関数を使用してください。
 * =============================================================================================================================
 * version 1.04 無宣言変数の修正、「isOccupied」関数の関連付け
 * version 1.03 パトロールリージョンバグの修正
 * version 1.02 mostXXX移動方法用のクラスタリングアルゴリズムを改善
 * version 1.01 新たに「avoid」およびaiMove用に「keepdistance」を追加
 * version 1.00 リリース
 * =============================================================================================================================
 * 互換性:
 * SRPG_RangeControlおよびSRPG_AIControlが必要です。本プラグインはそれらの下に配置してください。
 * =============================================================================================================================
 */

(function() {
	var parameters = PluginManager.parameters('SRPG_MoveMethod_MZ');
	var _maxMove = Number(parameters['search range']) || 40;
	var _confusionMoveRate = Number(parameters['confusion move rate']) || 0;
	var _fallBack = eval(parameters['enable fall back']);
	//parameters from AIControl
	var coreParameters = PluginManager.parameters('SRPG_AIControl_MZ');
	var _moveFormula = coreParameters['Move Formula'] || 'nearestOpponent';

//==========================================================================================================
// In search route mode, keep the movelist but make a movetable with _maxMove
//==========================================================================================================
	//this function only clear movetable, not movelist.
	Game_Temp.prototype.resetMoveTable = function() {
		this._MoveTable = [];
		for (var i = 0; i < $dataMap.width; i++) {
			var vartical = [];
			for (var j = 0; j < $dataMap.height; j++) {
				vartical[j] = [-1, []];
			}
			this._MoveTable[i] = vartical;
		}
	};

	Game_Temp.prototype.setSearchRouteMode = function(val) {
		this._SearchRouteMode = val;
	};

	//don't push MoveList in SearchRouteMode
	Game_Temp.prototype.pushMoveList = function(xy) {
		if (this._SearchRouteMode) return;
		else this._MoveList.push(xy);
	};

//==========================================================================================================
// method to check and set avoide damage floor
//==========================================================================================================
    var _SRPG_Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _SRPG_Game_Event_initMembers.call(this);
        this._avoidDamageFloor = undefined;
        this._aiMove = undefined;
    };

	Game_Event.prototype.setAvoidDamageFloor = function(val) {
		this._avoidDamageFloor = val;
	};

	Game_Event.prototype.isAvoidDamageFloor = function() {
		if (this._avoidDamageFloor !== undefined) return this._avoidDamageFloor;
		var user = $gameSystem.EventToUnit(this.eventId())[1];
		var result = false;
		if (this.event().meta.avoidDamageFloor) {
			result = eval(this.event().meta.avoidDamageFloor);
		} else if (user.isActor() && user.currentClass().meta.avoidDamageFloor) {
			result = eval(user.currentClass().meta.avoidDamageFloor);
		} else if (user.isActor() && user.actor().meta.avoidDamageFloor) {
			result = eval(user.currentClass().meta.avoidDamageFloor);
		} else if (user.isEnemy() && user.enemy().meta.avoidDamageFloor) {
			result = eval(user.enemy().meta.avoidDamageFloor);
		} else result = false;
		this.setAvoidDamageFloor(result);
		return result;
	};

//==========================================================================================================
//Cover the original srpgAICommand, add check for aiMoveMode, absregionUp/Down and more SkipAttack conditions
//==========================================================================================================
// modified by OhisamaCraft
	Scene_Map.prototype.srpgAICommand = function() {
		var event = $gameTemp.activeEvent();
		var type = $gameSystem.EventToUnit(event.eventId())[0];
		var user = $gameSystem.EventToUnit(event.eventId())[1];
		if (!event || !user) return false;

		//get validMoveList to check first.
		// set aiMoveMode
		var aiMoveMode = event.aiMove();
		if (aiMoveMode && (user.hpRate() < 1.0 || user.battleMode() !== 'stand')){
			user.setBattleMode(aiMoveMode);
		}
		//add check for SkipAttackMode, skip targeting if the mode is SkipAttackMode
		if (user.isSkipAttackMode()){
			$gameSystem.srpgMakeMoveTable(event);
			this.srpgAIPosition(user, event, user.action(0));
			return true;
		}
		//the following part of this function are the same
		var target = null;
		$gameTemp.setSrpgMoveTileInvisible(true);
		while (true) {
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
				if (aiMoveMode) user.setBattleMode(aiMoveMode);
				else user.setBattleMode('normal');
			} else {
				$gameTemp.clearMoveTable();
				user.onAllActionsEnd();
				$gameTemp.clearAreaTargets(); //shoukang clear areas
				$gameTemp.clearArea(); //shoukang clear areas
				return false;
			}
		}
		// decide movement, if not decided by target
		if (!$gameTemp.AIPos()) {
			this.srpgAIPosition(user, event, user.action(0));
		}

		return true;
	};

//==========================================================================================================
//New AI position method.
//==========================================================================================================
	Scene_Map.prototype.srpgAIPosition = function(user, event, action) {
		// make a bigger movetable using _maxMove while keeping movelist the same.
		$gameTemp.resetMoveTable();
		$gameTemp.setSearchRouteMode(true);
		event.makeMoveTable(event.posX(), event.posY(), _maxMove, [0], user.srpgThroughTag());

		//check aiMove method
		if (user.battleMode() === 'normal') user.setBattleMode(_moveFormula);
		if (user.confusionLevel() > 0) {
			$gameTemp.setSrpgPriorityTarget(null);
		} else {
			this.srpgPriorityTarget(user);
		}

		var bestXY = [event.posX(), event.posY()];
		var typeArray = [];
		var battleMode = user.battleMode();
		var targetEvent = $gameTemp.isSrpgPriorityTarget();
		var validMoveList = $gameTemp.validMoveList(event.isAvoidDamageFloor()); //get all valid move positions from movelist;

		// all move mode conditions
		if (targetEvent && targetEvent.isTargetValid()){
			var distRouteXY = $gameTemp.distRouteXY(targetEvent.posX(), targetEvent.posY(), event.posX(), event.posX(), true);
			bestXY = $gameTemp.bestXYinMoveList(validMoveList, distRouteXY[2][0], distRouteXY[2][1], distRouteXY[1]);
		} else if (battleMode === 'random' || 0.1 * _confusionMoveRate * user.confusionLevel() > Math.random()){
			bestXY = validMoveList[Math.floor(Math.random() * validMoveList.length)];
		} else if (battleMode.match(/\s*nearestOpponent/i)){
			typeArray = [(event.isType() === 'actor' ? 'enemy':'actor')];
			bestXY = $gameTemp.nearestTargetXY(validMoveList, typeArray, event.posX(), event.posY());
		} else if (battleMode.match(/\s*nearestFriend/i)){
			bestXY = $gameTemp.nearestTargetXY(validMoveList, [event.isType()], event.posX(), event.posY());
		} else if (battleMode.match(/\s*nearestUnitEvent/i)){
			bestXY = $gameTemp.nearestTargetXY(validMoveList, ['unitEvent'], event.posX(), event.posY());
		} else if (battleMode.match(/\s*nearestFlag(.+)/i)){//<mode:nearestFlag['xxxx']>
			typeArray = eval(battleMode.match(/\s*nearestFlag(.+)/i)[1]);
			bestXY = $gameTemp.nearestTargetXY(validMoveList, typeArray, event.posX(), event.posY());
		} else if (battleMode.match(/\s*mostOpponents/i)) {
			typeArray = [(event.isType() === 'actor' ? 'enemy':'actor')];
			bestXY = $gameTemp.mostPositionXY(validMoveList, typeArray, event.posX(), event.posY());
		} else if (battleMode.match(/\s*mostFriends/i)) {
			bestXY = $gameTemp.mostPositionXY(validMoveList, [event.isType()], event.posX(), event.posY());
		} else if (battleMode.match(/\s*mostFlags(.+)/i)) {//<mode:mostFlags['xxxx']>
			typeArray = eval(battleMode.match(/\s*mostFlags(.+)/i)[1]);
			bestXY = $gameTemp.mostPositionXY(validMoveList, typeArray, event.posX(), event.posY());
		} else if (battleMode.match(/\s*avoidOpponents/i)){//<mode:avoidOpponents> <mode:absAvoidOpponents>
			typeArray = [(event.isType() === 'actor' ? 'enemy':'actor')];
			bestXY = $gameTemp.avoidTargetXY(validMoveList, typeArray, false);
		} else if (battleMode.match(/\s*avoidFlags(.+)/i)){//<mode:avoidFlags['xxxx']>
			typeArray = eval(battleMode.match(/\s*avoidFlags(.+)/i)[1]);
			bestXY = $gameTemp.avoidTargetXY(validMoveList, typeArray, false);
		} else if (battleMode.match(/\s*regionUp/i)){
			bestXY = $gameTemp.bestRegionXY(validMoveList, 1);
		} else if (battleMode.match(/\s*regionDown/i)){
			bestXY = $gameTemp.bestRegionXY(validMoveList, - 1);
		} else if (battleMode.match(/\s*region\s+(\d+)/i)){ //<mode:region x>
			var regionId = Number(battleMode.match(/\s*region\s+(\d+)/i)[1]);
			bestXY = $gameTemp.certainRegionXY(validMoveList, regionId, event.posX(), event.posY());
		} else if (battleMode.match(/\s*position\s+(\d+)\s+(\d+)/i)){ //<mode:position x y>, <mode:absPosition x y>
			var posX = Number(battleMode.match(/\s*position\s+(\d+)\s+(\d+)/i)[1]);
			var posY = Number(battleMode.match(/\s*position\s+(\d+)\s+(\d+)/i)[2]);
			var distRouteXY = $gameTemp.distRouteXY(posX, posY, event.posX(), event.posX(), true);
			bestXY = $gameTemp.bestXYinMoveList(validMoveList, distRouteXY[2][0], distRouteXY[2][1], distRouteXY[1]);
		} else {
			bestXY = $gameTemp.battleModeExtension(battleMode, validMoveList, event, user, action);
		}

		$gameTemp.setAIPos({x: bestXY[0], y: bestXY[1]});
		$gameTemp.setSearchRouteMode(false);
	};

	// check aiIgnore
	Game_Event.prototype.isTargetValid = function() {
		var targetArray = $gameSystem.EventToUnit(this.eventId());
		if (targetArray && targetArray[1] && targetArray[1].priorityTag('aiIgnore')) return false;
		return true;
	};

	// check a tile is occupied or not, occupied by active event is not considered as occupied;
	Game_Map.prototype.isOccupied = function(x, y){
		return $gameMap.events().some(function(otherEvent) {
			return otherEvent.pos(x, y) && otherEvent.eventId() !== $gameTemp.activeEvent().eventId() && !otherEvent.isThrough() &&
			 !otherEvent.isErased() && (['enemy', 'actor', 'playerEvent'].contains(otherEvent.isType()));
		});
	};

	// return move tiles that are stepable, and consider avoid damagefloor.
	Game_Temp.prototype.validMoveList = function(avoidDamageFloor){
		var validMoveList = [];
		this.moveList().forEach(function (pos) {
			if (pos[2] !== false) return; // ignore range entries if found
			if (avoidDamageFloor && $gameMap.isDamageFloor(pos[0], pos[1])) return; //don't step on damage floor;
			if ($gameMap.isOccupied(pos[0], pos[1])) return;
			validMoveList.push([pos[0], pos[1]]);
		});
		if (validMoveList.length === 0) validMoveList.push([$gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()]);
		return validMoveList;
	};

	// get aiMoveFormula, example: <aiMove: 0.5 < a.hpRate() ? 'nearestOpponent' : 'mostFriends'>
	// writing anything like nearestOpponent + mostFriends is forbiddened, because it's not score system anymore.

	Game_Event.prototype.setAiMove = function (mode){
		this._aiMove = mode;
	};

	Game_Interpreter.prototype.setAiMove = function (eventId, mode){
		var battlerArray = $gameSystem.EventToUnit(eventId);
		if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
	        $gameMap.event(eventId).setAiMove("\""+mode+"\"");
	    }
	    return true;
	};

	Game_Event.prototype.aiMove = function (){
		var user = $gameSystem.EventToUnit(this.eventId())[1];
		var a = user;
		var event = this;
		var meta = false;
		if (this._aiMove !== undefined) {
			meta = this._aiMove;
		} else if ($gameTemp.targetEvent() && this.eventId() === $gameTemp.targetEvent().eventId() && action.item() && action.item().meta.aiMove) {//self targeting skill (does it really work?)
			meta = action.item().meta.aiMove;
		} else if (this.event().meta.aiMove){
			meta = this.event().meta.aiMove;
		} else if (user.isActor() && user.currentClass().meta.aiMove) {
			meta = user.currentClass().meta.aiMove;
		} else if (user.isActor() && user.actor().meta.aiMove) {
			meta = user.actor().meta.aiMove;
		} else if (user.isEnemy() && user.enemy().meta.aiMove) {
			meta = user.enemy().meta.aiMove;
		}
		this.setAiMove(meta);
		//console.log([this._aiMove, meta, eval(this._aiMove)])
		if (!meta) return false; 
		var result = this.aiMoveExtension(eval(meta), a);
		if (result) return result;
		else return eval(meta);
	};
	
//==========================================================================================================
//add more self-defined aiMove here
//==========================================================================================================
	Game_Event.prototype.aiMoveExtension = function(meta, a){
		if (meta === 'timid'){
			if (a.hpRate() > 0.8) return 'nearestOpponent';
			else return 'escape';
		} else if (meta.match(/\s*patrolRegion\s+(\d+)\s+(\d+)/i)) {//<aiMove: patrolRegion x y>
			var region1 = Number(meta.match(/\s*patrolRegion\s+(\d+)\s+(\d+)/i)[1]);
			var region2 = Number(meta.match(/\s*patrolRegion\s+(\d+)\s+(\d+)/i)[2]);
			var currentRegion = $gameMap.regionId(this.posX(), this.posY()) || 0;
			if (currentRegion === region1) return 'region ' + region2;
			else if (currentRegion === region2) return 'region ' + region1;
			else if (a.battleMode() !== 'region ' + region1 && a.battleMode() !== 'region ' + region2) return 'region ' + region1;
			else return a.battleMode();
		} else if (meta.match(/keepDist\s+(\d+)/i)){//<aiMove:'keepDist x'>
			var atkDist = meta.match(/keepDist\s+(\d+)/i)[1];
			var ctrlDist = false;
			if(meta.match(/keepDist\s+(\d+)\s+(\d+)/i)) ctrlDist = meta.match(/keepDist\s+(\d+)\s+(\d+)/i)[2];
			this.makeMoveTable(this.posX(), this.posY(), a.srpgMove(), [0], a.srpgThroughTag());
			var validMoveList = $gameTemp.validMoveList(this.isAvoidDamageFloor()); 
			$gameTemp.clearMoveTable();
			typeArray = [(this.isType() === 'actor' ? 'enemy':'actor')];
			bestXY = $gameTemp.avoidTargetXY(validMoveList, typeArray, ctrlDist);
			if (bestXY[2] > atkDist) {
				return 'absposition ' + bestXY[0] + ' ' + bestXY[1];
			} else return 'nearestOpponent';
		}
		return false;
	};

	//use this to build more move method
	Game_Temp.prototype.battleModeExtension = function(battleMode, validMoveList, event, user, action){
		if (battleMode ==='customizedMode'){

		} else return [event.posX(), event.posY()];
	};

	// these mode will make the AI skip targeting process and just move, extend it to have more conditions
	Game_Battler.prototype.isSkipAttackMode = function(){
		var mode = this.battleMode();
		if (mode === 'escape'){
			this.setBattleMode('nearestFriend');
			return true;
		} else if (mode.match(/abs/i)){
			return true
		}
		return false;
	};

//==========================================================================================================
//route search methods
//==========================================================================================================
	//return best stop position aiming nearest valid target
	Game_Temp.prototype.nearestTargetXY = function(validMoveList, typeArray, eventX, eventY){
		var nearestDist = _maxMove + $gameMap.width() + $gameMap.height();
		var bestTargetXY = [eventX, eventY];
		var route = [];
		var activeEventId = $gameTemp.activeEvent().eventId();
		$gameMap.events().forEach(function(otherEvent) {
			if (otherEvent.eventId() === activeEventId || otherEvent.isErased() || !otherEvent.isTargetValid()) return;
			if (typeArray.contains(otherEvent.isType()) || typeArray.contains(otherEvent.aiFlag())){
				var distRouteXY = $gameTemp.distRouteXY(otherEvent.posX(), otherEvent.posY(), eventX, eventY, nearestDist);
				if (distRouteXY[0] < nearestDist){
					nearestDist = distRouteXY[0];
					route = distRouteXY[1];
					bestTargetXY = distRouteXY[2];
				}
			}
		});
		return this.bestXYinMoveList(validMoveList, bestTargetXY[0], bestTargetXY[1], route);
	};

	//return best stop position aiming mean position of all vaild targets
	Game_Temp.prototype.mostPositionXY = function(validMoveList, typeArray, eventX, eventY){
		var count = 1;
		var totalDist = 0;
		var totalUnit = [];
		var activeEventId = $gameTemp.activeEvent().eventId();
		$gameMap.events().forEach(function(otherEvent) {
			if (otherEvent.eventId() === activeEventId || otherEvent.isErased() || !otherEvent.isTargetValid()) return;
			if (typeArray.contains(otherEvent.isType()) || typeArray.contains(otherEvent.aiFlag())){
				totalUnit.push(otherEvent);
			}
		});
		if (totalUnit.length == 0) return [eventX, eventY];

		for (var i = 0; i < totalUnit.length; i++){
			for (var j = i + 1; j < totalUnit.length; j ++){
				totalDist += totalUnit[i].distTo(totalUnit[j].posX(), totalUnit[j].posY());
				count += 1;
			}
		}
		var threshold = Math.round(Math.pow(totalDist/count, 3/5));
		var maxClusters = this.getMaxClusters(totalUnit, threshold);
		//console.log(threshold);
		var bestDist = Number.POSITIVE_INFINITY;
		for (var i = 0; i < maxClusters.length; i++){
			var sumX = 0;
			var sumY = 0;
			for (var j = 0; j < maxClusters[i].length; j++){
				sumX += maxClusters[i][j].posX();
				sumY += maxClusters[i][j].posY();
			}
			var distRouteXY = this.distRouteXY(Math.round(sumX / maxClusters[i].length), Math.round(sumY / maxClusters[i].length), eventX, eventY, true);
			if (distRouteXY[0] < bestDist){
				var bestDistRouteXY = distRouteXY;
				bestDist = distRouteXY[0];
			}
		}
		var bestXY = bestDistRouteXY[2];
		return this.bestXYinMoveList(validMoveList, bestXY[0], bestXY[1], bestDistRouteXY[1]);
	};


//DBSCAN method to get clusters
	Game_Temp.prototype.getMaxClusters = function(totalUnit, threshold){
		var visited = new Set();
		var clusters = [];
		for (var i = 0; i < totalUnit.length; i++){
			if (visited.has(totalUnit[i])) continue;
			var id = clusters.length;
			var stack = [totalUnit[i]];
			clusters.push([]);
			while (stack.length > 0){
				var unit = stack.pop();
				clusters[id].push(unit);
				visited.add(unit);
				for (var j = i + 1; j < totalUnit.length; j ++){
					if (visited.has(totalUnit[j])) continue; 
					if (unit.distTo(totalUnit[j].posX(), totalUnit[j].posY()) <= threshold){
						stack.push(totalUnit[j]);
						visited.add(totalUnit[j]);
					}
				}
			}	
		}
		//console.log(clusters);
		var maxClusters = [];
		maxClusters.push([]);
		for (var i = 0; i < clusters.length; i++){
			if (maxClusters[0].length < clusters[i].length){
				maxClusters = [clusters[i]];
			} else if (maxClusters[0].length == clusters[i].length){
				maxClusters.push(clusters[i]);
			}
		}
		return maxClusters;
	}

	// region up: mode = 1, region down: mode = -1
	Game_Temp.prototype.bestRegionXY = function(validMoveList, mode){
		var bestScore = -256;
		var bestXY = null;
		validMoveList.forEach(function(pos){
			var region = $gameMap.regionId(pos[0], pos[1]) || 0;
			var score = region * mode;
			if (score > bestScore){
				bestScore = score;
				bestXY = pos;
			}
		});
		return bestXY;
	};

	// get the best stop position given regionId
	Game_Temp.prototype.certainRegionXY = function(validMoveList, regionId, oriX, oriY){
		var width = $gameMap.width();
		var height = $gameMap.height();
		var minDist = _maxMove + width + height;
		var bestXY = [oriX, oriY];
		var route = [];
		var fallBackXY = [oriX, oriY];
		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){
				if ($gameMap.regionId(i, j) !== regionId) continue;
				if ($gameMap.isOccupied(i, j)){
					fallBackXY = [i, j];
					continue;
				}
				var distRouteXY = this.distRouteXY(i, j, oriX, oriY, minDist);
				if (distRouteXY[0] < minDist){
					minDist = distRouteXY[0];
					route = distRouteXY[1];
					bestXY = distRouteXY[2];
				}
			}
		}
		if (minDist >= _maxMove + width + height){//no valid pos, use fallback
			var distRouteXY = $gameTemp.distRouteXY(fallBackXY[0], fallBackXY[1], oriX, oriY, true);
			route = distRouteXY[1];
			bestXY = distRouteXY[2];
		}
		return this.bestXYinMoveList(validMoveList, bestXY[0], bestXY[1], route);
	};

	Game_Temp.prototype.avoidTargetXY = function(validMoveList, typeArray, ctrlDist){
		var targetList = [];
		var activeEventId = $gameTemp.activeEvent().eventId();
		$gameMap.events().forEach(function(otherEvent) {
			if (otherEvent.eventId() === activeEventId || otherEvent.isErased() || !otherEvent.isTargetValid()) return;
			if (typeArray.contains(otherEvent.isType()) || typeArray.contains(otherEvent.aiFlag())){
				targetList.push([otherEvent.posX(), otherEvent.posY()]);
			}
		});
		return this.farestXYinMoveList(validMoveList, targetList, ctrlDist);
	};

	//given a certain position, return a best reachable [distance, route to destination, destination's [x, y]]
	Game_Temp.prototype.distRouteXY = function(x, y, oriX, oriY, fallBackMove){
		var minDist = _maxMove + $gameMap.distTo(x, y, oriX, oriY);
		if (this.MoveTable(x, y)[0] >= 0 && !$gameMap.isOccupied(x, y)){//if stepable
			minDist = _maxMove - this.MoveTable(x, y)[0];
			return [minDist, this.MoveTable(x, y)[1], [x, y]];
		}

		// check distance = 1 positions stepable or not
		for (var d = 2; d < 10; d += 2) {
			var dx = $gameMap.roundXWithDirection(x, d);
			var dy = $gameMap.roundYWithDirection(y, d);
			if ($gameMap.isValid(dx, dy)){
				if (this.MoveTable(dx, dy)[0] >= 0 && _maxMove - this.MoveTable(dx, dy)[0] + 1 < minDist) { // +1 is not accurate but it should be fine
					minDist = _maxMove - this.MoveTable(dx, dy)[0] + 1;
					var minX = dx;
					var minY = dy;
				} 
			}
		}

		if (minDist < _maxMove){ //distance = 1 positions stepable
			var route = this.MoveTable(minX, minY)[1];
			return [minDist, route, [minX, minY]];
		} else if (_fallBack && fallBackMove && ( fallBackMove === true || fallBackMove > _maxMove)){ // blocked! use fall back if set true or: this _maxMove < minDist sent from fallBackMove
			return this.fallBackDistRouteXY(x, y);
		} else return [minDist, [0], [oriX, oriY]];
	};

	// given an unreachable position, return a best reachable [Dist,Route, [X,Y]]
	Game_Temp.prototype.fallBackDistRouteXY = function(x, y){
		var width = $gameMap.width();
		var height = $gameMap.height();
		var minDist = width + height;
		var bestXY = [x, y];
		var bestList = [];
		for (var i = 0; i < width; i++){
			for (var j = 0; j < height; j++){
				var rmove = this.MoveTable(i, j)[0];
				if (rmove < 0) continue;
				var dist = $gameMap.distTo(i, j, x, y);
				if (dist < minDist){
					minDist = dist;
					bestXY = [i, j];
					bestList = [[i, j, rmove]];
				} else if (dist === minDist) bestList.push([i, j, rmove])
			}
		}
		bestList.sort(function (a, b) {
			return b[2] - a[2];
		});
		bestXY = bestList[0];
		var route = this.MoveTable(bestXY[0], bestXY[1])[1];
		var dist = _maxMove + minDist;
		return [dist, route, bestXY];
	};

	//given a reachable position's x, y and route, return the best stop position in valid move list.
	Game_Temp.prototype.bestXYinMoveList = function(validMoveList, bestTargetX, bestTargetY, route){
		var nearestDist = _maxMove + $gameMap.width() + $gameMap.height();
		var distance = nearestDist;
		var bestXY = validMoveList[0];
		for (var i = 0; i < validMoveList.length; i++){
			var pos = validMoveList[i];
			distance = this.routeDistance(bestTargetX, bestTargetY, pos[0], pos[1], route);
			if (distance < nearestDist){
				nearestDist = distance;
				bestXY = pos;
			}
		}
		return bestXY;
	};

	Game_Temp.prototype.farestXYinMoveList = function(validMoveList, targetList, ctrlDist){
		var maxDist = 0;
		var maxDistOri = 0;
		var bestXY = validMoveList[0];
		for (var i = 0; i < validMoveList.length; i++){
			var pos = validMoveList[i];
			var minDist = $gameMap.width() + $gameMap.height();
			for (var j = 0; j < targetList.length; j++){
				var targetXY = targetList[j];
				var dist = $gameMap.distTo(pos[0], pos[1], targetXY[0], targetXY[1]);
				if (dist < maxDist) {
					minDist = 0;
					break;
				}
				minDist = Math.min(dist, minDist);
			}
			if (ctrlDist && minDist > ctrlDist) continue;
			if (minDist > maxDist){
				maxDist = minDist;
				bestXY = pos;
			}
			if (i === 0) maxDistOri = minDist;
		}
		return [bestXY[0], bestXY[1], maxDist, maxDistOri];//also return maxDist and maxDistOri(plan to check distance to determine skip attack or not)
	};

	//if the position is within the route to [endX, endY], return real distance from [x, y] to [endX, endY], else return directdistance + _maxMove
	// 1 tile next to a route tile will also be considered as in route, the real distance can be easily calculated.
	Game_Temp.prototype.routeDistance = function(endX, endY, x, y, route) {
		var event = $gameTemp.activeEvent();
		var dx = endX;
		var dy = endY;
		if (event && event.posX() === x && event.posY() === y) return $gameMap.distTo(x, y, endX, endY) + _maxMove; //original pos not considered as in route
		if (!route) return false;
		for(var i = route.length; i > 1; i--){ //route[0] = 0
			var d = route[i] || 0;
			dx = $gameMap.roundXWithDirection(dx, 10 - d);
			dy = $gameMap.roundYWithDirection(dy, 10 - d);
			if (x === dx && y === dy) return this.MoveTable(dx, dy)[0] - this.MoveTable(endX, endY)[0];
			if ($gameMap.distTo(x, y, dx, dy) <= 1){
				d = route[i - 1];
				dx = $gameMap.roundXWithDirection(dx, 10 - d);
				dy = $gameMap.roundYWithDirection(dy, 10 - d);
				return this.MoveTable(dx, dy)[0] - this.MoveTable(endX, endY)[0];
			}
		}
		return $gameMap.distTo(x, y, endX, endY) + _maxMove; //if not within best route return this;
	};

})();
