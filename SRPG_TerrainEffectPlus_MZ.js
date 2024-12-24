//=============================================================================
// SRPG_TerrainEffectPlus_MZ.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc This plugin provides terrain effects (status changes based on terrain) and adds a terrain effect window.
 * @author Boomy, Shoukang, Takumi Ariake
 * @base SRPG_core_MZ
 * @base SRPG_AuraSkill_MZ
 * @orderAfter SRPG_core_MZ
 * @orderAfter SRPG_AuraSkill_MZ
 *
 * @param Terrain Tag 0 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 0. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 1 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 1. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 2 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 2. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 3 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 3. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 4 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 4. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 5 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 5. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 6 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 6. It will be disabled if set to 0.
 * @default 0
 * 
 * @param Terrain Tag 7 state
 * @type state
 * @desc This is the ID of the state to set for terrain tag 7. It will be disabled if set to 0.
 * @default 0
 * 
 * @param use Terrain Effect Window
 * @desc Choose whether to use the terrain effect window.
 * @type boolean
 * @default true
 * 
 * @param Window width
 * @desc The width of the terrain effect window.
 * @type number
 * @default 180
 * 
 * @param Window position
 * @desc Set the position of the terrain effect window.
 * @type select
 * @option left
 * @option right
 * @default right
 * 
 * @param close Terrain Effect Window during events
 * @desc Set whether to close the terrain effect window during events.
 * @type boolean
 * @default true
 * 
 * 
 * @command closeTerrainEffectWindow
 * @text Close the terrain effect window.
 * @desc Closes the terrain effect window. It will reopen when the cursor is moved.
 * 
 * @command openTerrainEffectWindow
 * @text Open the terrain effect window.
 * @desc This is only valid when the BattlePhase is set to 'actor_phase'.
 * 
 * @help
 * Copyright (c) 2024 SRPG team. All rights reserved.
 * Released under the MIT license.
 * ===================================================================
 * This plugin is based on Boomy's SRPG_TerrainEffect and 
 * Shoukang's SRPG_TerrainEffectWindow.
 * 
 * SRPG_AuraSkill_MZ.js is required for this plugin to work. 
 * Please place this plugin below SRPG_AuraSkill_MZ.js in the plugin manager.
 * 
 * The plugin applies terrain effects (status changes due to terrain) by 
 * assigning states to terrain tags. 
 * When a unit stands on a tile with a specific terrain tag, 
 * the corresponding state is applied, providing terrain-based status changes.
 * 
 * To implement terrain effects, create states beforehand for the desired effects, 
 * and use the plugin parameters to assign those states to each terrain tag.
 * In the terrain effect window, the state name and icon will be displayed, 
 * along with any custom text (up to 4 lines) set in the state's note (tag).
 *
 * ============================================================================
 * New Tags (Notes)
 * ============================================================================
 * === State Notes ===
 *   <terrainText1:X>
 *   <terrainText2:X>
 *   <terrainText3:X>
 *   <terrainText4:X>
 *      # These are the strings displayed in the terrain effect window. 
 *      # You can set up to 4 lines.
 * 
 * ============================================================================
 * Processes Executable via Event Command > Script (Plugin command)
 * ============================================================================
 *  Note:
 *  The following script commands are only valid when 
 *  'Close Terrain Effect Window during events' (a setting to automatically 
 *  close the terrain effect window during events) is set to false.
 * 
 *  this.closeTerrainEffectWindow();
 *      # Closes the terrain effect window.
 *  this.openTerrainEffectWindow();
 *      # Opens the terrain effect window. 
 *      # This is only valid during the 'actor_phase' BattlePhase.
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc 地形効果（地形によるステータス変化）を提供します。地形効果ウィンドウも追加します。
 * @author Boomy, Shoukang, 有明タクミ
 * @base SRPG_core_MZ
 * @base SRPG_AuraSkill_MZ
 * @orderAfter SRPG_core_MZ
 * @orderAfter SRPG_AuraSkill_MZ
 *
 * @param Terrain Tag 0 state
 * @type state
 * @desc 地形タグ 0 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 1 state
 * @type state
 * @desc 地形タグ 1 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 2 state
 * @type state
 * @desc 地形タグ 2 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 3 state
 * @type state
 * @desc 地形タグ 3 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 4 state
 * @type state
 * @desc 地形タグ 4 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 5 state
 * @type state
 * @desc 地形タグ 5 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 6 state
 * @type state
 * @desc 地形タグ 6 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param Terrain Tag 7 state
 * @type state
 * @desc 地形タグ 7 に設定するステートのIDです。0 で無効化されます。
 * @default 0
 * 
 * @param use Terrain Effect Window
 * @desc 地形効果ウィンドウを使用するか選択します。
 * @type boolean
 * @default true
 * 
 * @param Window width
 * @desc 地形効果ウィンドウの横幅です。
 * @type number
 * @default 180
 * 
 * @param Window position
 * @desc 地形効果ウィンドウの位置を設定します。
 * @type select
 * @option left
 * @option right
 * @default right
 * 
 * @param close Terrain Effect Window during events
 * @desc イベント中は地形効果ウィンドウを閉じるか設定します。
 * @type boolean
 * @default true
 * 
 * 
 * @command closeTerrainEffectWindow
 * @text 地形効果ウィンドウを閉じる
 * @desc 地形効果ウィンドウを閉じます。カーソル移動で再び開きます。
 * 
 * @command openTerrainEffectWindow
 * @text 地形効果ウィンドウを開く
 * @desc BattlePhaseが'actor_phase'の時のみ有効です。
 * 
 * @help
 * Copyright (c) 2024 SRPG team. All rights reserved.
 * Released under the MIT license.
 * ===================================================================
 * このプラグインは、Boomy氏のSRPG_TerrainEffect, 
 * Shoukang氏のSRPG_TerrainEffectWindowをベースに作られています。
 * 
 * 動作にはSRPG_AuraSkill_MZ.jsが必要です。
 * このプラグインは管理画面でSRPG_AuraSkill_MZ.jsより下に配置してください。
 * 
 * 地形タグごとにステートを設定し、その地形タグのタイルの上に立った時に
 * 設定されたステートを付与することで地形効果（地形によるステータス変化）を
 * 実現します。
 * あらかじめ、地形効果にするためのステートを作成しておき、
 * プラグインパラメータから地形タグごとに付与するステートを設定してください。
 * ステートは専用のものを用意することを推奨します。
 * 
 * 地形効果のウィンドウには、ステート名とアイコンが表示されるほか、
 * ステートのメモ（タグ）で設定した任意の文字列を4行まで表示できます。
 *
 * ============================================================================
 * 新規のタグ（メモ）
 * ============================================================================
 * === ステートのメモ ===
 *   <terrainText1:X>
 *   <terrainText2:X>
 *   <terrainText3:X>
 *   <terrainText4:X>
 *      # 地形効果ウィンドウに表示される文字列です。4行まで設定可能です。
 * 
 * ============================================================================
 * イベントコマンド＞スクリプト（プラグインコマンド）で実行できる処理
 * ============================================================================
 *  注意
 *  以下のスクリプトコマンドは、'close Terrain Effect Window during events'
 *  （イベント中に自動で地形効果ウィンドウが閉じる設定）がfalseの時のみ有効です。
 * 
 *  this.closeTerrainEffectWindow();
 *      # 地形効果ウィンドウを閉じます
 *  this.openTerrainEffectWindow();
 *      # 地形効果ウィンドウを開きます。BattlePhaseが'actor_phase'でのみ有効です。
 */

//====================================================================
// ●Function Declaration
//====================================================================
// terrain effect 用のステータスウィンドウ
function Window_SrpgTerrainEffect() {
    this.initialize(...arguments);
}

Window_SrpgTerrainEffect.prototype = Object.create(Window_StatusBase.prototype);
Window_SrpgTerrainEffect.prototype.constructor = Window_SrpgTerrainEffect;

//====================================================================
// ●Plug in
//====================================================================
(function () {

    var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);

    var parameters = PluginManager.parameters(scriptName);
    var _terrainTag0state = Number(parameters['Terrain Tag 0 state'] || 0);
    var _terrainTag1state = Number(parameters['Terrain Tag 1 state'] || 0);
    var _terrainTag2state = Number(parameters['Terrain Tag 2 state'] || 0);
    var _terrainTag3state = Number(parameters['Terrain Tag 3 state'] || 0);
    var _terrainTag4state = Number(parameters['Terrain Tag 4 state'] || 0);
    var _terrainTag5state = Number(parameters['Terrain Tag 5 state'] || 0);
    var _terrainTag6state = Number(parameters['Terrain Tag 6 state'] || 0);
    var _terrainTag7state = Number(parameters['Terrain Tag 7 state'] || 0);
    var _tagStateList = [_terrainTag0state, _terrainTag1state, _terrainTag2state, _terrainTag3state, _terrainTag4state, _terrainTag5state, _terrainTag6state, _terrainTag7state];

    var _useTerrainEffectWindow = parameters['use Terrain Effect Window'] || 'true';
    var _windowWidth = Number(parameters['Window width'] || 180);
    var _windowPosition = parameters['Window position'] || 'right';
    var _closeTerrainEffectWindowDuringEvents = parameters['close Terrain Effect Window during events'] || 'true';

//====================================================================
// ●Plugin Command
//====================================================================
    PluginManager.registerCommand(scriptName, "closeTerrainEffectWindow", function() {
        this.closeTerrainEffectWindow();
    });

    PluginManager.registerCommand(scriptName, "openTerrainEffectWindow", function() {
        this.openTerrainEffectWindow();
    });

    // ---------------------------------------------------------------------------------------
    // Game_BattlerBase
    // ---------------------------------------------------------------------------------------
    const _SRPG_TerrainEffect_Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _SRPG_TerrainEffect_Game_BattlerBase_initMembers.call(this);
        this._terrainTag = -1;
    };

    Game_BattlerBase.prototype.setTerrainTag = function(tag) {
        this._terrainTag = tag;
    };

    Game_BattlerBase.prototype.terrainTag = function() {
        return this._terrainTag;
    };

    // ---------------------------------------------------------------------------------------
    // refreshAura (need SRPG_AuraSkill)
    // ---------------------------------------------------------------------------------------
    const _SRPG_TerrainEffect_Game_Temp_refreshAura = Game_Temp.prototype.refreshAura;
    Game_Temp.prototype.refreshAura = function(userevent) {
        _SRPG_TerrainEffect_Game_Temp_refreshAura.call(this, userevent);
        if (!userevent) return;
        const unitArray = $gameSystem.EventToUnit(userevent.eventId());
		if (!unitArray) return;
		const user = unitArray[1];
        const terrainTag = user.terrainTag();
        const newTerrainTag = userevent.terrainTag();
        if (terrainTag !== newTerrainTag) {
            for (var i = 0; i < _tagStateList.length; i++) {
                var stateId = _tagStateList[i];
                if (stateId > 0) user.removeState(stateId);
            }
            const terrainStateId = _tagStateList[newTerrainTag];
            if (terrainStateId > 0) {
                if (user.isStateAddable(terrainStateId)) {
                    user.addState(terrainStateId);
                    user.setTerrainTag(newTerrainTag);
                } else {
                    user.setTerrainTag(-1);
                }
            }
        }
	};

	// アクターコマンドからの装備変更の後処理
	const _SRPG_TerrainEffect_Scene_Map_srpgAfterActorEquip = Scene_Map.prototype.srpgAfterActorEquip;
	Scene_Map.prototype.srpgAfterActorEquip = function() {
		const unitArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
		if (!unitArray) return;
		const user = unitArray[1];
		user.setTerrainTag(-1);
        $gameTemp.refreshAura($gameTemp.activeEvent());
        _SRPG_TerrainEffect_Scene_Map_srpgAfterActorEquip.call(this);
    };

    // ---------------------------------------------------------------------------------------
    // Game_System
    // ---------------------------------------------------------------------------------------
    // 行動中アクターの簡易ステータスウィンドウのリフレッシュフラグを返す
    Game_System.prototype.srpgTerrainEffectWindowNeedRefresh = function() {
        return this._SrpgTerrainEffectWindowRefreshFlag;
    };

    // 地形効果ウィンドウのリフレッシュフラグを設定する（同時に地形タグを保持する）
    Game_System.prototype.setSrpgTerrainEffectWindowNeedRefresh = function(terrainTag, adjacent) {
        this._SrpgTerrainEffectWindowRefreshFlag = [true, terrainTag, adjacent];
    };

    // 地形効果ウィンドウのリフレッシュフラグをクリアする
    Game_System.prototype.clearSrpgTerrainEffectWindowNeedRefresh = function() {
        this._SrpgTerrainEffectWindowRefreshFlag = [false, null, undefined];
    };

    // アクターコマンドウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
	const _SRPG_TerrainEffect_Game_System_setSrpgActorCommandWindowNeedRefresh = Game_System.prototype.setSrpgActorCommandWindowNeedRefresh;
    Game_System.prototype.setSrpgActorCommandWindowNeedRefresh = function(battlerArray) {
		_SRPG_TerrainEffect_Game_System_setSrpgActorCommandWindowNeedRefresh.call(this, battlerArray);
		$gameSystem.clearSrpgTerrainEffectWindowNeedRefresh();
    };

    // アクターコマンドウィンドウのリフレッシュフラグをクリアする
    const _SRPG_TerrainEffect_Game_System_clearSrpgActorCommandWindowNeedRefresh = Game_System.prototype.clearSrpgActorCommandWindowNeedRefresh;
    Game_System.prototype.clearSrpgActorCommandWindowNeedRefresh = function() {
        _SRPG_TerrainEffect_Game_System_clearSrpgActorCommandWindowNeedRefresh.call(this);
        const playerTerrainTag = $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y);
        const terrainStateId = _tagStateList[playerTerrainTag];
        if (terrainStateId > 0) $gameSystem.setSrpgTerrainEffectWindowNeedRefresh(playerTerrainTag, true);
    };

    // ---------------------------------------------------------------------------------------
    // Game_Interpreter
    // ---------------------------------------------------------------------------------------
    // 地形効果ウィンドウを閉じる
    Game_Interpreter.prototype.closeTerrainEffectWindow = function() {
        $gameSystem.clearSrpgTerrainEffectWindowNeedRefresh();
        return true;
    };

    // 地形効果ウィンドウを開く
    Game_Interpreter.prototype.openTerrainEffectWindow = function() {
        if ($gameSystem.isBattlePhase() === 'actor_phase'){
            const playerTerrainTag = $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y);
            const terrainStateId = _tagStateList[playerTerrainTag];
            if (terrainStateId > 0) {
                $gameSystem.setSrpgTerrainEffectWindowNeedRefresh(playerTerrainTag, true);
            }
        }
        return true;
    };

    // ---------------------------------------------------------------------------------------
    // Window_SrpgTerrainEffect
    // ---------------------------------------------------------------------------------------
    // 初期化
    Window_SrpgTerrainEffect.prototype.initialize = function(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._terrainTagId = -1;
        this._terrainEffect = undefined;
        this.openness = 0;
        this.refresh();
    };

    // windowの高さを返す
    Window_SrpgTerrainEffect.prototype.windowHeight = function() {
        let textLength = 1;
        if (!this._terrainEffect) return this.fittingHeight(textLength);
        if (this._terrainEffect.meta.terrainText1) textLength += 0.7;
        if (this._terrainEffect.meta.terrainText2) textLength += 0.7;
        if (this._terrainEffect.meta.terrainText3) textLength += 0.7;
        if (this._terrainEffect.meta.terrainText4) textLength += 0.7;
        return this.fittingHeight(textLength);
    };

    // 地形IDのセット
    Window_SrpgTerrainEffect.prototype.setTerrainTag = function(id) {
        if (this._terrainTagId !== id) {
            this._terrainTagId = id;
            this.refresh();
            this.open();
        }        
    };

    // 地形IDのクリア
    Window_SrpgTerrainEffect.prototype.clearTerrainTag = function() {
        this._terrainTagId = -1;
        this.refresh();
        this.close();
    };

    // 地形IDを返す
    Window_SrpgTerrainEffect.prototype.terrainTag = function() {
        return this._terrainTagId;
    };

    // リフレッシュ
    Window_SrpgTerrainEffect.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._terrainTagId >= 0) {
            const terrainStateId = _tagStateList[this._terrainTagId];
            this._terrainEffect = $dataStates[terrainStateId];
            this.height = this.windowHeight();
            this.innerHeight = this.windowHeight();
            this.drawContents();
        }
    };

    // 地形効果を描画する
    Window_SrpgTerrainEffect.prototype.drawContents = function() {
        const lineHeight = this.lineHeight() - 4;
        const y = 8;
        let lineNum = 0;
        this.drawItemName(this._terrainEffect, 0, 4, this.innerWidth);
        this.contents.fontSize -= 6;
        const text1 = this._terrainEffect.meta.terrainText1;
        if (text1) {
            lineNum += 1;
            this.drawText(text1, 0, y + lineHeight * lineNum, this.innerWidth);
        }
        const text2 = this._terrainEffect.meta.terrainText2;
        if (text2) {
            lineNum += 1;
            this.drawText(text2, 0, y + lineHeight * lineNum, this.innerWidth);
        }
        const text3 = this._terrainEffect.meta.terrainText3;
        if (text3) {
            lineNum += 1;
            this.drawText(text3, 0, y + lineHeight * lineNum, this.innerWidth);
        }
        const text4 = this._terrainEffect.meta.terrainText4;
        if (text4) {
            lineNum += 1;
            this.drawText(text4, 0, y + lineHeight * lineNum, this.innerWidth);
        }
        this.contents.fontSize += 6;
    };

    // ---------------------------------------------------------------------------------------
    // Scene_Map
    // ---------------------------------------------------------------------------------------
    // 全てのウィンドウ作成
    const _SRPG_TerrainEffect_SceneMap_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        this.createSrpgTerrainEffectWindow();
        _SRPG_TerrainEffect_SceneMap_createAllWindows.call(this);
    };

    // 地形効果ウィンドウを作る
    Scene_Map.prototype.createSrpgTerrainEffectWindow = function() {
        const rect = this.srpgTerrainEffectWindowRect();
        this._mapSrpgTerrainEffectWindow = new Window_SrpgTerrainEffect(rect);
        this._mapSrpgTerrainEffectWindow.openness = 0;
        this.addWindow(this._mapSrpgTerrainEffectWindow);
    };

    // 地形効果ウィンドウのrectを設定する
    Scene_Map.prototype.srpgTerrainEffectWindowRect = function() {
        const ww = _windowWidth;
        const wh = this.calcWindowHeight(4, false);
        const wx = (_windowPosition === 'left') ? 0 : Graphics.boxWidth - ww;
        const wy = this.helpAreaTop() + 8;
        return new Rectangle(wx, wy, ww, wh);
    };

    // ウィンドウの開閉
    const _SRPG_TerrainEffect_Scene_Map_srpgWindowOpenClose = Scene_Map.prototype.srpgWindowOpenClose;
    Scene_Map.prototype.srpgWindowOpenClose = function() {
        _SRPG_TerrainEffect_Scene_Map_srpgWindowOpenClose.call(this);
        // 地形効果ウィンドウの開閉
        var flag = $gameSystem.srpgTerrainEffectWindowNeedRefresh();
        if (!flag) flag = [false, null, undefined];
        if (flag[0]) {
            if (!this._mapSrpgTerrainEffectWindow.isOpen() && !this._mapSrpgTerrainEffectWindow.isOpening()) {
                this._mapSrpgTerrainEffectWindow.setTerrainTag(flag[1]);
            } else if (flag[2]) {
                this._mapSrpgTerrainEffectWindow.setTerrainTag(flag[1]);
                $gameSystem.setSrpgTerrainEffectWindowNeedRefresh(flag[1]);

            }
        } else {
            if (this._mapSrpgTerrainEffectWindow.isOpen() && !this._mapSrpgTerrainEffectWindow.isClosing()) {
                this._mapSrpgTerrainEffectWindow.clearTerrainTag();
            }
        }
    };

    // カーソル移動時の処理
	const _SRPG_TerrainEffect_Scene_Map_srpgMovementExtension = Scene_Map.prototype.srpgMovementExtension;
    Scene_Map.prototype.srpgMovementExtension = function() {
        _SRPG_TerrainEffect_Scene_Map_srpgMovementExtension.call(this);
		if (_useTerrainEffectWindow === 'true' && 
            ($gameSystem.isBattlePhase() === 'actor_phase' &&
			($gameSystem.isSubBattlePhase() === 'normal' || $gameSystem.isSubBattlePhase() === 'actor_move'))){
            const playerTerrainTag = $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y);
            const terrainStateId = _tagStateList[playerTerrainTag];
            if (terrainStateId > 0) {
                if (playerTerrainTag !== this._mapSrpgTerrainEffectWindow.terrainTag()) {
                    $gameSystem.setSrpgTerrainEffectWindowNeedRefresh(playerTerrainTag, true);
                }
            } else {
                $gameSystem.clearSrpgTerrainEffectWindowNeedRefresh();
            }
		} else {
            $gameSystem.clearSrpgTerrainEffectWindowNeedRefresh();
        }
    };

    // updateの拡張部分
    const _SRPG_TerrainEffect_Scene_Map_srpgExtendProcessing = Scene_Map.prototype.srpgExtendProcessing;
    Scene_Map.prototype.srpgExtendProcessing = function() {
        _SRPG_TerrainEffect_Scene_Map_srpgExtendProcessing.call(this);
        if (_closeTerrainEffectWindowDuringEvents === 'true') {
            if ($gameMap.isEventRunning() && 
                (this._mapSrpgTerrainEffectWindow.isOpen() && !this._mapSrpgTerrainEffectWindow.isClosing())) {
                $gameSystem.clearSrpgTerrainEffectWindowNeedRefresh();
            } else if (_useTerrainEffectWindow === 'true' && $gameMap.isEventRunning() === false &&
            (!this._mapSrpgTerrainEffectWindow.isOpen() && !this._mapSrpgTerrainEffectWindow.isOpening()) &&
            ($gameSystem.isBattlePhase() === 'actor_phase' &&
			($gameSystem.isSubBattlePhase() === 'normal' || $gameSystem.isSubBattlePhase() === 'actor_move'))) {
                const playerTerrainTag = $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y);
                const terrainStateId = _tagStateList[playerTerrainTag];
                if (terrainStateId > 0) {
                    if (playerTerrainTag !== this._mapSrpgTerrainEffectWindow.terrainTag()) {
                        $gameSystem.setSrpgTerrainEffectWindowNeedRefresh(playerTerrainTag, true);
                    }
                } else {
                    $gameSystem.clearSrpgTerrainEffectWindowNeedRefresh();
                }
            }
        }
    };

})();
