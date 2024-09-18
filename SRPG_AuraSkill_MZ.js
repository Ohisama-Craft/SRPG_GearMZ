//=============================================================================
// SRPG_AuraSkill_MZ.js
// Copyright (c) 2020 Shoukang. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//-----------------------------------------------------------------------------
// Free to use and edit   version 1.06 fix bug for aura range 0. Fix bug for not removing states properly
//=============================================================================
/*:
 * @target MZ
 * @plugindesc This plugin allows you to create Aura skills for SRPG battle. Place it below all SRPG plugins for best compatibility, edited by OhisamaCraft.
 * @author Shoukang
 * @base SRPG_core_MZ
 * @orderAfter SPPG_AoE_MZ
 * @orderAfter SRPG_ShowAoERange_MZ
 * @orderAfter SRPG_BattleUI_MZ
 * 
 * @param max range
 * @desc This is the max range for Aura detection, shape is square. This range should equal to your largest Aura range.
 * @type number
 * @min 1
 * @default 3
 *
 * @param default range
 * @desc If not specified this is the default range of an Aura.
 * @type number
 * @default 2
 *
 * @param default target
 * @desc Input "friend", "foe" or "all".
 * @type string
 * @default friend
 *
 * @param default shape
 * @desc If not specified this is the default shape of an Aura, refer to SRPG_AOE.
 * @type string
 * @default circle
 *
 * @param Aura color
 * @desc Set the color of Aura tile 
 * https://www.w3schools.com/cssref/css_colors.asp
 * @type string
 * @default green
 *
 * @param show Aura color
 * @desc always show the color of Aura tiles 
 * @type boolean
 * @default true
 *
 * @help
 * copyright 2020 Shoukang. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * This plugin provides several note tags for you to create Aura skills. 
 * An aura skill will add a state automatically to valid units in Aura range.
 * Passive Aura skills can be created by skill notetags. It will assign the (sub)state to valid units within the Aura range.
 * Active aura skills can be created by state notetags. You can actively use a skill to gain an "Aura state", as long as this Aura state
 * exist it will assign a (sub)state to the valid units within the Aura range. (Credits to Boomy)
 * This also allows you to activate aura effects in other ways(add this aura state by script calls, or whatever else)
 * Now Events with <type:unitEvent> <type:object> can also have passive Aura.
 * =========================================================================================================================
 * skill/event/state note tags:
 * <SRPGAuraState:x>    this is the (sub)state this skill/event/state will assign (to valid units), replace x with (sub)state id.
 * <SRPGAuraTarget:xxx> This is the units that will be affected, xxx can be "friend" "foe" or "all". For unitevent/object, friend is actor and foe is enemy.(no need to add quote)
 * <SRPGAuraRange:x>    The range of Aura, similar to AoE range.
 * <SRPGAuraShape:xxx>  The shape of Aura, replace xxx with shapes defined in SRPR_AoE (Anisotropic shapes not supported)
 * <SRPGAuraMinRange:x> The minumum range of Aura, creats a hole. Default is 0.
 * <SRPGAuraColor:xxx>  The color of this Aura skill. https://www.w3schools.com/cssref/css_colors.asp
 * <SRPGShowAura:x>     If have this notetag, show this aura's range on movetable.
 * You may also want to use state note tag <SRPGAura> (see below).
 * 
 * state note tag:
 * <SRPGAura>           With this notetag a state will be removed once a unit is out of the Aura. Give this notetag to the (sub)state.
 * If you want the Aura to be effective after a unit leaves the Aura range don't use this tag.
 *
 * event note tag:
 * <SRPGAuraPage:x>     On which event page is the aura active. If don't write the aura is always active (unless it's erased).The first page is 0, 2nd page is 1, etc.
 *
 * Aura states of related units will be refreshed everytime you open the SRPGstatuswindow, 
 * prediction window, menu window. It will also refresh when show movetable, before battle, after action, battle start and turn end.
 * You can also assign Aura skills to enemies.
 * You may want to use some other plugins like ALOE_ItemSkillSortPriority to put a passive aura skill to the end of 
 * your skill list.
 * ==========================================================================================================================
 * version 1.06 fix bug for aura range 0. Fix bug for not removing states properly
 * version 1.05 support aura for unitevents and objects!
 * version 1.04 show aura range on movetable!
 * version 1.03 add state note tags for active aura skills. Fix issues of states without <SRPGAura>
 * version 1.02 refresh status when turn end.
 * version 1.01 refresh status when open main menu. fix some bugs.
 * version 1.00 first release!
 * ===========================================================================================================================
 * Compatibility:
 * This plugin needs SPPG_AoE to work. Place this plugin below SRPG_ShowAoERange, SRPG_BattleUI if you are using them.
 * ===========================================================================================================================
 */

/*:ja
 * @target MZ
 * @plugindesc SRPG戦闘にて「オーラ」スキルを使用可能にするプラグインです。どのSRPGプラグインよりも下に配置してください。（おひさまクラフトによる改変）
 * @author Shoukang
 * @base SRPG_core_MZ
 * @orderAfter SPPG_AoE_MZ
 * @orderAfter SRPG_ShowAoERange_MZ
 * @orderAfter SRPG_BattleUI_MZ
 * 
 * @param max range
 * @desc オーラの最大有効範囲（形状は正方形）。この射程は最大オーラ射程と一致している必要があります。
 * @type number
 * @min 1
 * @default 3
 *
 * @param default range
 * @desc 特に指定されていない場合、この値がオーラのデフォルト射程となります。
 * @type number
 * @default 2
 *
 * @param default target
 * @desc "friend"、"foe"または"all"のいずれかを指定してください。
 * @type string
 * @default friend
 *
 * @param default shape
 * @desc 特に指定されていない場合、これがオーラのデフォルト形状となります。SRPG_AOEを参照してください。
 * @type string
 * @default circle
 *
 * @param Aura color
 * @desc オーラタイルの色を設定してください。 
 * https://www.w3schools.com/cssref/css_colors.asp
 * @type string
 * @default green
 *
 * @param show Aura color
 * @desc オーラタイルを常に表示するかどうか 
 * @type boolean
 * @default true
 *
 * @help
 * copyright 2020 Shoukang. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 本プラグインは、オーラスキルを作成するためのメモタグを提供します。 
 * オーラスキルはオーラ射程内の有効なユニットに自動的にステートを付与します。
 * パッシブオーラスキルはスキルのメモタグにより作成できます。オーラ射程内の有効なユニットに（サブ）ステートを付与します。
 * アクティブオーラスキルはステートのメモタグにて作成できます。「オーラステート」を得るためスキルを使用することができます。
 * オーラステートが存在している限り、オーラ射程内の有効なユニットに（サブ）ステートを付与します。(Credits to Boomy)
 * それ以外の方法（スクリプト呼び出しによるオーラステートの追加など）でオーラ効果を有効化することもできます。
 * <type:unitEvent> <type:object>が記述されているイベントにもパッシブオーラを設定できるようになりました。
 * =========================================================================================================================
 * スキル/イベント/ステートのメモタグ：
 * <SRPGAuraState:x>    スキル/イベント/ステートが付与する（サブ）ステートです。xを（サブ）ステートのIDに置き換えてください。
 * <SRPGAuraTarget:xxx> これは影響を受けるユニットの設定です。xxxは「friend」（味方）、「foe」（敵）あるいは「all」（両方）に置き換えてください。unitevent/objectの場合、味方はアクターで敵は敵キャラになります。
 * <SRPGAuraRange:x>    オーラの射程です。AoE射程とほぼ同じです。
 * <SRPGAuraShape:xxx>  オーラの形状です。xxxをSRPR_AoEにて定義されている形状に置き換えてください（方向による形状の変化はサポート外です）
 * <SRPGAuraMinRange:x> オーラの最小射程で、射程に穴ができます。デフォルトは0です。
 * <SRPGAuraColor:xxx>  このオーラスキルの色です。https://www.w3schools.com/cssref/css_colors.asp
 * <SRPGShowAura:x>     このメモタグがある場合、このオーラの射程が移動範囲上に表示されます。
 * ステートに<SRPGAura>メモタグを使用する場合、以下を参照してください。
 * 
 * ステートメモタグ:
 * <SRPGAura>           このメモタグを記述すると、ユニットがオーラの射程外に存在する場合ステートが解除されます。このメモタグを（サブ）ステートに設定してください。
 * オーラ射程からユニットが離れても有効にする場合、このタグを使用しないでください。
 *
 * イベントメモタグ:
 * <SRPGAuraPage:x>     このオーラがアクティブになるイベントページ。記述がない場合、オーラは常にアクティブになります（イベントが消去されない限り）。最初のページは0として数えます。
 *
 * オーラステートにかかわっているユニットはSRPGstatuswindowウィンドウ、予測ウィンドウおよびメニューを開くたびに更新されます。 
 * 移動範囲、戦闘前、戦闘後、戦闘開始およびターン終了時にも更新されます。
 * オーラスキルは敵キャラにも設定できます。
 * ALOE_ItemSkillSortPriorityを使用してパッシブオーラスキルをスキルリストの一番下に配置するなど、別のプラグインとの連携もできます。
 * ==========================================================================================================================
 * version 1.06 オーラ射程0の場合のバグを修正。ステートが適切に解除されないバグを修正。
 * version 1.05 uniteventおよびオブジェクトへのオーラの設定をサポート！
 * version 1.04 移動範囲にオーラ射程を表示できるようになりました！
 * version 1.03 アクティブオーラスキル用のステートメモタグを追加。<SRPGAura>のないステートの不具合を修正。
 * version 1.02 ターン終了時にステータスを更新するように修正。
 * version 1.01 メインメニューを開いたときにステータスを更新するように修正。いくつかのバグを修正。
 * version 1.00 リリース
 * ===========================================================================================================================
 * 互換性:
 * 本プラグインの動作にはSPPG_AoEが必要です。使用している場合は、SRPG_ShowAoERangeやSRPG_BattleUIよりも下に配置してください。
 * ===========================================================================================================================
 */

(function () {
	var parameters = PluginManager.parameters('SRPG_AuraSkill_MZ');
	var _maxRange = parameters['max range'] || 3;
	var _defaultRange = parameters['default range'] || 2;
	var _defaultTarget = parameters['default target'] || "friend";
	var _defaultShape = parameters['default shape'] || "circle";
	var _defaultColor = parameters['Aura color'] || "green";
	var _showColor = parameters['show Aura color'] || 'true';

//refresh aura at the following conditions.

	var shoukang_SrpgStatus_refresh = Window_SrpgStatus.prototype.refresh;
	Window_SrpgStatus.prototype.refresh = function() {
		this.contents.clear();
		if (!this._battler) return;
		$gameTemp.refreshAura($gameTemp.activeEvent());//refresh aura when open srpgstatus window
		if ($gameTemp.targetEvent()) $gameTemp.refreshAura($gameTemp.targetEvent());
		shoukang_SrpgStatus_refresh.call(this);
	};

	var shoukang_Game_System_srpgMakeMoveTable = Game_System.prototype.srpgMakeMoveTable;
	Game_System.prototype.srpgMakeMoveTable = function(event) {
		$gameTemp.refreshAura(event);
		shoukang_Game_System_srpgMakeMoveTable.call(this, event);
		if (!$gameMap.isEventRunning() && $gameSystem.isBattlePhase() === 'actor_phase') $gameTemp.makeAuraList(event);//show aura color
	}

	var shoukang_Scene_Map_eventAfterAction = Scene_Map.prototype.eventAfterAction;
	Scene_Map.prototype.eventAfterAction = function() {
		if ($gameTemp.areaTargets().length === 0) $gameTemp.refreshAura($gameTemp.activeEvent());    	
		shoukang_Scene_Map_eventAfterAction.call(this);
	};

	var shoukang_Game_System_runBattleStartEvent = Game_System.prototype.runBattleStartEvent;
	Game_System.prototype.runBattleStartEvent = function() {
		$gameMap.events().forEach(function(event) {
				if (event.isErased()) return;
				var unit = $gameSystem.EventToUnit(event.eventId());
				if (unit && (unit[0] === 'actor' || unit[0] === 'enemy')) $gameTemp.refreshAura(event);
		});
		shoukang_Game_System_runBattleStartEvent.call(this);
	};

	// modified by OhisamaCraft
	var shoukang_Scene_Map_eventBeforeBattle = Scene_Map.prototype.eventBeforeBattle;
	Scene_Map.prototype.eventBeforeBattle = function() {
		$gameTemp.refreshAura($gameTemp.activeEvent());
		if ($gameTemp.targetEvent()) $gameTemp.refreshAura($gameTemp.targetEvent());//refresh aura before battle
		if ($gameTemp.areaTargets().length > 0){
			$gameTemp.areaTargets().forEach(function(target){
				$gameTemp.refreshAura(target.event);
			});
		}
		shoukang_Scene_Map_eventBeforeBattle.call(this);
	};

	// modified by OhisamaCraft
	// アクターコマンド・キャンセル
	var shoukang_Scene_Map_selectPreviousActorCommand = Scene_Map.prototype.selectPreviousActorCommand;
    Scene_Map.prototype.selectPreviousActorCommand = function() {
		shoukang_Scene_Map_selectPreviousActorCommand.call(this);
		const event = $gameTemp.activeEvent();
		const user = $gameSystem.EventToUnit(event.eventId())[1];
		const userMove = user.srpgMove();
		$gameTemp.refreshAura(event);
		const userMove2 = user.srpgMove();
		if (userMove !== userMove2) {
			$gameTemp.clearMoveTable();
			this._spriteset.update();
			$gameSystem.srpgMakeMoveTable(event);
		}
		this._mapSrpgActorCommandStatusWindow.refresh();
    };

	var shoukang_Game_System_srpgTurnEnd = Game_System.prototype.srpgTurnEnd;
	Game_System.prototype.srpgTurnEnd = function() {//shoukang turn end
		$gameMap.events().forEach(function(event) {
				if (event.isErased()) return;
				var unit = $gameSystem.EventToUnit(event.eventId());
				if (unit && (unit[0] === 'actor' || unit[0] === 'enemy')) $gameTemp.refreshAura(event);
		});
		shoukang_Game_System_srpgTurnEnd.call(this);
	};

	var shoukang_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
	Scene_Menu.prototype.createCommandWindow = function() {
		shoukang_Scene_Menu_createCommandWindow.call(this);
		if ($gameSystem.isSRPGMode() == true) {
			$gameMap.events().forEach(function (event){
				if (event.isErased()) return;
				var unit = $gameSystem.EventToUnit(event.eventId());
				if (unit && unit[0] === 'actor') $gameTemp.refreshAura(event);
			});
		}
	};

	// アクターコマンドウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
	// modified by OhisamaCraft
	var shoukang_Game_System_setSrpgActorCommandWindowNeedRefresh = Game_System.prototype.setSrpgActorCommandWindowNeedRefresh;
    Game_System.prototype.setSrpgActorCommandWindowNeedRefresh = function(battlerArray) {
		shoukang_Game_System_setSrpgActorCommandWindowNeedRefresh.call(this, battlerArray);
		$gameTemp.updateAuraList();
    };

//Aura functions start here

	Game_Battler.prototype.clearAura = function() {
		var statelist = this.states();
		for (i = statelist.length - 1; i >= 0; i--){
			if (statelist[i].meta.SRPGAura) {
				this.eraseState(statelist[i].id)//v1.06 update
			}
		}
		this.refresh();
	};

	Game_Temp.prototype.refreshAura = function(userevent) {
		const userArray = $gameSystem.EventToUnit(userevent.eventId());
		if (!userArray) return;
		const user = userArray[1];
		user.clearAura();
		const x = userevent.posX();
		const y = userevent.posY();
		$gameMap.events().forEach(function (event) {//check all events
			var dx = x - event.posX();
			var dy = y - event.posY();
			if (event.isErased() || Math.abs(dx) > _maxRange || Math.abs(dy) > _maxRange) return;//if beyond maxrange return, just to save time.
			var unit = $gameSystem.EventToUnit(event.eventId());
			if (unit && (unit[0] === 'actor' || unit[0] === 'enemy')){
				unit[1].skills().forEach( function(item){//check all skills
					if ($gameTemp.isAuraStateValid(item, userevent.isType(), unit[0], dx, dy)) user.addState(Number(item.meta.SRPGAuraState));
				});
				unit[1].states().forEach(function(item){//check all states
					if ($gameTemp.isAuraStateValid(item, userevent.isType(), unit[0], dx, dy)) user.addState(Number(item.meta.SRPGAuraState));
				});
			} else if (event.isType() === 'unitEvent' || event.isType() === 'object'){
				var item = event.event()
				if (item.meta.SRPGAuraPage && Number(item.meta.SRPGAuraPage) != event.pageIndex()) return;
				if ($gameTemp.isAuraStateValid(item, userevent.isType(), 'actor', dx, dy)) user.addState(Number(item.meta.SRPGAuraState));
			}
		});
	};

	Game_Temp.prototype.isAuraStateValid = function(item, usertype, ownertype, dx, dy) {
		if (item.meta.SRPGAuraState){
			var type = item.meta.SRPGAuraTarget || _defaultTarget;
			var range = Number(item.meta.SRPGAuraRange || _defaultRange);
			var shape = item.meta.SRPGAuraShape || _defaultShape;
			var minrange = Number(item.meta.SRPGAuraMinRange) || 0;
			if (!$gameMap.inArea(dx, dy, range, minrange, shape, 0)) return false;
			if (type === 'friend' && ownertype == usertype) return true;
			if (type === 'foe' && ownertype != usertype) return true;
			if (type === 'all') return true;
		}
		return false;
	};

// visualize Aura on movetable

	Game_Temp.prototype.makeAuraList = function(userevent) {
		var unit = $gameSystem.EventToUnit(userevent.eventId());
		var orix = userevent.posX()
		var oriy = userevent.posY()
		var route = userevent._srpgForceRoute;//this is used to refresh Aura when opening SrpgActorCommand;
		for (var i = 0; i < route.length; i++){
			orix = $gameMap.roundXWithDirection(orix, route[i]);
			oriy = $gameMap.roundYWithDirection(oriy, route[i]);
		}
		unit[1].skills().forEach( function(item){//check all skills
			if (item.meta.SRPGAuraState && (_showColor === 'true' || item.meta.SRPGShowAura)){
				$gameTemp.pushAuratoMoveList(item, orix, oriy);
			}
		});
		unit[1].states().forEach(function(item){//check all states
			if (item.meta.SRPGAuraState && (_showColor === 'true' || item.meta.SRPGShowAura)){
				$gameTemp.pushAuratoMoveList(item, orix, oriy);
			}
		});
	};

	Game_Temp.prototype.pushAuratoMoveList = function(item, orix, oriy) {
		var range = Number(item.meta.SRPGAuraRange) || _defaultRange;
		var shape = item.meta.SRPGAuraShape || _defaultShape;
		var minrange = Number(item.meta.SRPGAuraMinRange) || 0;
		var color = item.meta.SRPGAuraColor || _defaultColor;
		var limx = $gameMap.width() - orix + range;
		var limy = $gameMap.height() - oriy + range;
		for (var x = Math.max(0, range -orix); x < 1+range*2 && x < limx; x++) {
			for (var y = Math.max(0, range -oriy); y < 1+range*2 && y < limy; y++) {
				if ($gameMap.inArea(x-range, y-range, range, minrange, shape,0)) {
					$gameTemp.pushMoveList([orix + x -range, oriy + y - range, ['Aura', color]]);
				}
			}
		}
	};

	Game_Temp.prototype.updateAuraList = function() {
		for (var i = this._MoveList.length - 1; i >= 0; i--){
			if (this._MoveList[i][2][0] === "Aura") {
				this._MoveList.splice(i, 1);
			}
		}
		$gameTemp.setResetMoveList(true);
		this.makeAuraList($gameTemp.activeEvent());
	};

	var shoukang_setThisMoveTile = Sprite_SrpgMoveTile.prototype.setThisMoveTile;
	Sprite_SrpgMoveTile.prototype.setThisMoveTile = function(x, y, attackFlag) {
		shoukang_setThisMoveTile.call(this, x, y, attackFlag);
		if (attackFlag[0] === "Aura") {
			this.aura = true;
			this.bitmap.fillAll(attackFlag[1]);
		}
	};

	var shoukang_Sprite_SrpgMoveTile_initialize = Sprite_SrpgMoveTile.prototype.initialize;
	Sprite_SrpgMoveTile.prototype.initialize = function() {
		shoukang_Sprite_SrpgMoveTile_initialize.call(this);
		this.aura = false;
	};

	var shoukang_Sprite_SrpgMoveTile_clearThisMoveTile = Sprite_SrpgMoveTile.prototype.clearThisMoveTile;
	Sprite_SrpgMoveTile.prototype.clearThisMoveTile = function() {
		shoukang_Sprite_SrpgMoveTile_clearThisMoveTile.call(this);
		this.aura = false;
	}

	Sprite_SrpgMoveTile.prototype.updateAnimation = function() {
		this._frameCount++;
		this._frameCount %= 90;
		if (!this.aura) this.opacity = 210 - Math.abs(this._frameCount - 45) * 2;
		else this.opacity = Math.abs(this._frameCount - 45) * 5 - 90;
	};

	if (!Game_Enemy.prototype.skills) {
		Game_Enemy.prototype.skills = function() {
			var skills = []
			for (var i = 0; i < this.enemy().actions.length; ++i) {
				var skill = $dataSkills[this.enemy().actions[i].skillId];
				if (skill) skills.push(skill);
			}
			return skills;
		}
	};
})();
