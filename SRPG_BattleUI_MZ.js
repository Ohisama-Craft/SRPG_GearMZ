//-----------------------------------------------------------------------------
// SRPG_BattleUI_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
* @target MZ
* @plugindesc SRPG Battle UI adjustment, edited by Shoukang and Ohisama Craft.
* @author SRPG Team
* @base SRPG_core_MZ
* @orderAfter SRPG_core_MZ
* @orderAfter SRPG_BattlePrepare_MZ
* 
* @param useTurnWindow
* @desc Change the display of the Turns window.(true / false)
* @type boolean
* @default true
*
* @param textTurn
* @desc A term for turn. It is displayed in the menu window.
* @default turn
*
* @param menuActorDisplayCount
* @desc Number of actors displayed on the menu status window.
* @type select
* @option 4
* @value 1
* @option 6
* @value 2
* @option 8
* @value 3
* @option 12
* @value 4
* @option 16
* @value 5
* @default 1
* 
* @param menuActorGraphicType
* @desc actor graphics in menu status window. (1: Face / 2: Character / 3: Battler)
* @type select
* @option Face
* @value 1
* @option Character
* @value 2
* @option Battler
* @value 3
* @default 1
*
* @help
* copyright 2020 SRPG Team. all rights reserved.
* Released under the MIT license.
* ============================================================================
* My (RyanBram) simple plugin for adjusting RPG Maker MV UI (menu)
* to make it more unique for SRPG Battle
* edited by Shoukang to support battlePrepare plugin compatibility
* Please place it below the battlePrepare plugin.
* and modified by OhisamaCraft
*/

/*:ja
* @target MZ
* @plugindesc SRPG戦闘でのメニュー画面の変更(Shoukang, おひさまクラフトによる改変あり)
* @author SRPG Team
* @base SRPG_core_MZ
* @orderAfter SRPG_core_MZ
* @orderAfter SRPG_BattlePrepare_MZ
*
* @param useTurnWindow
* @desc ターン数ウィンドウの表示を変更します。(true / false)
* @type boolean
* @default true
* 
* @param textTurn
* @desc ターン数を表す用語です。メニュー画面で使用されます。
* @default ターン
* 
* @param menuActorDisplayCount
* @desc メニュー画面で表示するアクターの人数
* @type select
* @option 4人
* @value 1
* @option 6人
* @value 2
* @option 8人
* @value 3
* @option 12人
* @value 4
* @option 16人
* @value 5
* @default 1
* 
* @param menuActorGraphicType
* @desc メニュー画面で表示するアクターのグラフィック。(1:フェイス / 2:キャラクター / 3:バトラー)
* @type select
* @option フェイス
* @value 1
* @option キャラクター
* @value 2
* @option バトラー
* @value 3
* @default 1
*
* @help
* copyright 2020 SRPG Team. all rights reserved.
* Released under the MIT license.
* ============================================================================
* RyanBram氏による、メニュー画面をSRPGバトル向けUIに変更するプラグイン
* Shoukang氏のbattlePrepare pluginとの競合対策あり
* battlePrepare pluginより下に配置してください。
* おひさまクラフトによる改変あり
*/

//====================================================================
// ●Plugin
//====================================================================
(function () {
  'use strict';

  const switchId = 1;

  var parameters = PluginManager.parameters('SRPG_BattleUI_MZ');
  var _useTurnWindow = parameters['useTurnWindow'] || 'true';
  var _textTurn = parameters['textTurn'] || 'ターン';
  var _menuActorDisplayCount = Number(parameters['menuActorDisplayCount'] || 1);
  var _menuActorGraphicType = Number(parameters['menuActorGraphicType'] || 1);

  var coreParameters = PluginManager.parameters('SRPG_core_MZ');
	var _turnVarID = Number(coreParameters['turnVarID'] || 3);
  var _srpgTileSpriteBlendMode = Number(coreParameters['srpgTileSpriteBlendMode'] || 0);

  var battlePrepareParameters = PluginManager.parameters('SRPG_BattlePrepare_MZ');
	var _lockIconIndex = Number(battlePrepareParameters['lockIconIndex']|| 195);

// ==============================================================================
//GHANGE MENU COMMAND && MAKE TRUN WINDOW ---------------------------------------
// ==============================================================================
  const SRPG_UI_Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    SRPG_UI_Scene_Menu_createCommandWindow.call(this);
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._commandWindow.height = this._commandWindow.fittingHeight(this._commandWindow.maxItems());
      this._commandWindow.x = (Graphics.boxWidth - this._commandWindow.width)/2;
      this._commandWindow.y = (Graphics.boxHeight - this._commandWindow.height)/2; // 150
      // ターンウィンドウも一緒に作る
      const rect = this.turnWindowRect();
      this._turnWindow = new Window_Turn(rect);
      if (_useTurnWindow !== 'true') this._turnWindow.hide();
      this.addWindow(this._turnWindow);
    }
  };

  const SRPG_UI_Scene_Menu_createStatusWindow = Scene_Menu.prototype.createStatusWindow;
  Scene_Menu.prototype.createStatusWindow = function() {
    SRPG_UI_Scene_Menu_createStatusWindow.call(this);
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._statusWindow.x = (Graphics.boxWidth - this._statusWindow.width)/2;
      this._statusWindow.hide();
      this._goldWindow.hide();
    }
  };

  const SRPG_UI_Scene_Menu_commandPersonal = Scene_Menu.prototype.commandPersonal;
  Scene_Menu.prototype.commandPersonal = function () {
    SRPG_UI_Scene_Menu_commandPersonal.call(this);
    this.showStatusAndHideCommand();
  };

  const SRPG_UI_Scene_Menu_commandFormation = Scene_Menu.prototype.commandFormation;
  Scene_Menu.prototype.commandFormation = function () {
    SRPG_UI_Scene_Menu_commandFormation.call(this);
    this.showStatusAndHideCommand();
  };

  Scene_Menu.prototype.turnWindowRect = function() {
    const ww = this.mainCommandWidth() - 60;
    const wh = this.calcWindowHeight(1, true);
    const wx = 0;
    const wy = this.mainAreaBottom() - wh;
    return new Rectangle(wx, wy, ww, wh);
  };

  const SRPG_UI_Scene_Menu_onPersonalCancel = Scene_Menu.prototype.onPersonalCancel;
  Scene_Menu.prototype.onPersonalCancel = function () {
    SRPG_UI_Scene_Menu_onPersonalCancel.call(this);
    this.showCommandAndHideStatus();
  };

  const SRPG_UI_Scene_Menu_onFormationCancel = Scene_Menu.prototype.onFormationCancel;
  Scene_Menu.prototype.onFormationCancel = function () {
    SRPG_UI_Scene_Menu_onFormationCancel.call(this);
    this.showCommandAndHideStatus();
  };

  Scene_Menu.prototype.showStatusAndHideCommand = function () {
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._commandWindow.hide();
      this._turnWindow.hide();
      this._statusWindow.show();
    }
  };

  Scene_Menu.prototype.showCommandAndHideStatus = function () {
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._commandWindow.show();
      if (_useTurnWindow === 'true') this._turnWindow.show();
      this._statusWindow.hide();
    }
  };

//-----------------------------------------------------------------------------
// Window_Turn
//
// The window for displaying the SRPG turn.

function Window_Turn() {
  this.initialize(...arguments);
}

Window_Turn.prototype = Object.create(Window_Selectable.prototype);
Window_Turn.prototype.constructor = Window_Turn;

  Window_Turn.prototype.initialize = function(rect) {
    Window_Selectable.prototype.initialize.call(this, rect);
    this.refresh();
  };

  Window_Turn.prototype.colSpacing = function() {
    return 0;
  };

  Window_Turn.prototype.refresh = function() {
    const rect = this.itemLineRect(0);
    const x = rect.x;
    const y = rect.y;
    const width = rect.width;
    this.contents.clear();
    this.drawCurrencyValue(this.value(), this.currencyUnit(), x, y, width);
  };

  Window_Turn.prototype.value = function() {
    return $gameVariables.value(_turnVarID);
  };

  Window_Turn.prototype.currencyUnit = function() {
    return _textTurn;
  };

  Window_Turn.prototype.show = function() {
    this.refresh();
    Window_Selectable.prototype.show.call(this);
  };

// ==============================================================================
// REMOVE MENU COMMAND ----------------------------------------------------------
// ==============================================================================

  const SRPG_UI_Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
  Window_MenuCommand.prototype.addMainCommands = function() {
    if ($gameSystem.isSRPGMode()) {
      this.addCommand(TextManager.status, 'status', this.areMainCommandsEnabled());
    } else {
      SRPG_UI_Window_MenuCommand_addMainCommands.call(this);
    }
  };

  const SRPG_UI_Window_MenuCommand_addFormationCommand = Window_MenuCommand.prototype.addFormationCommand;
  Window_MenuCommand.prototype.addFormationCommand = function() {
    if (!$gameSystem.isSRPGMode()) {
      SRPG_UI_Window_MenuCommand_addFormationCommand.call(this);
    }
  };

// ==============================================================================
// CHANGE SRPG Movement Indicator -----------------------------------------------
// ==============================================================================

    Sprite_SrpgMoveTile.prototype.createBitmap = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth - 4, tileHeight - 4);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = _srpgTileSpriteBlendMode;
    };

// ==============================================================================
//GHANGE MENU STATUS WINDOW -----------------------------------------------------
// ==============================================================================
  Sprite_Gauge.prototype.bitmapWidth = function() {
    if (this._statusType === "exp") {
      return 92;
  } else {
      return 128;
  }
  };

  Window_StatusBase.prototype.loadFaceImages = function() {
    for (const actor of $gameParty.members()) {
        ImageManager.loadFace(actor.faceName());
        if (_menuActorGraphicType === 2) ImageManager.loadCharacter(actor.characterName());
        if (_menuActorGraphicType === 3) ImageManager.loadSvActor(actor.battlerName());
    }
  };

  // prettier-ignore
  Window_Base.prototype.drawBattler = function(
    battlerName, x, y
  ) {
    const bitmap = ImageManager.loadSvActor(battlerName);
    const pw = bitmap.width / 9;
    const ph = bitmap.height / 6;
    const sx = 1 * pw;
    const sy = 0;
    this.contents.blt(bitmap, sx, sy, pw, ph, x - pw / 2, y - ph);
  };

  Window_StatusBase.prototype.drawActorBattler = function(actor, x, y) {
    this.drawBattler(actor.battlerName(), x, y);
  };

  Window_StatusBase.prototype.drawActorSimpleStatus = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const x2 = x + 180;
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2);
    this.drawActorClass(actor, x2, y);
    this.placeBasicGauges(actor, x2, y + lineHeight);
};

  Window_StatusBase.prototype.drawActorSimpleStatus6 = function(actor, x, y) {
    const lineHeight = this.lineHeight() - 8;
    const x2 = x + 180;
    this.drawActorName(actor, x, y);
    this.drawActorLevel(actor, x, y + lineHeight * 1);
    this.drawActorIcons(actor, x, y + lineHeight * 2 - 4);
    this.placeBasicGauges(actor, x2, y + 4);
  };

  Window_StatusBase.prototype.drawActorSimpleStatus8 = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const x2 = x + 132;
    const heightPadding = 8;
    this.drawActorName(actor, x, y, 160);
    this.drawActorIcons(actor, x + 2, y + lineHeight * 2 + heightPadding * 2 + 2);
    this.drawActorLevel(actor, x2 + 36, y + heightPadding);
    this.placeBasicGauges(actor, x2, y + lineHeight + heightPadding);
  };

  Window_StatusBase.prototype.drawActorSimpleStatus12 = function(actor, x, y) {
    const lineHeight = this.lineHeight() - 8;
    const x2 = x + 132;
    const heightPadding = 6;
    this.drawActorName(actor, x, y);
    this.drawActorIcons(actor, x, y + lineHeight * 2 - 4);
    this.drawActorLevel(actor, x2 + 36, y + heightPadding);
    this.placeGauge(actor, "hp", x2, y + lineHeight + heightPadding);
    this.placeGauge(actor, "mp", x2, y + lineHeight + heightPadding + this.gaugeLineHeight());
  };

  Window_StatusBase.prototype.drawActorSimpleStatus16 = function(actor, x, y) {
    const lineHeight = this.lineHeight();
    const heightPadding = 28;
    this.drawActorName(actor, x, y, 124);
    this.drawActorLevel(actor, x + 32, y + lineHeight * 2 + heightPadding);
  };

  //-----------------------------------------------------------------------------
  // Window_MenuStatus
  //
  Window_MenuStatus.prototype.maxCols = function() {
    if (_menuActorDisplayCount === 5) {
      return 4;
    } else if (_menuActorDisplayCount > 2) {
      return 2;
    } else {
      return 1;
    }
  };

  Window_MenuStatus.prototype.numVisibleRows = function() {
    if (_menuActorDisplayCount === 1 || _menuActorDisplayCount === 3 || _menuActorDisplayCount === 5) {
      return 4;
    } else {
      return 6;
    }
  };

  Window_MenuStatus.prototype.drawItemImage = function(index) {
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() === 'battle_prepare') {
      const actor = this.actor(index);
      const rect = this.itemRect(index);
      const width = (_menuActorDisplayCount === 5) ? 124 : ImageManager.standardFaceWidth;
      const height = rect.height - 2;
      const heightPadding = (this.numVisibleRows() === 4) ? 0 : 8;
      if ($gameParty.inRemainingActorList(actor.actorId())) {
          this.changePaintOpacity(false);
      } else {
          this.changePaintOpacity(true);
      }
      if (_menuActorGraphicType === 1) {
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
      } else if (_menuActorGraphicType === 2) {
        this.drawActorCharacter(actor, rect.x + width / 2, rect.y + height * 0.7 + heightPadding);
      } else if (_menuActorGraphicType === 3) {
        this.drawActorBattler(actor, rect.x + width / 2, rect.y + height * 0.75 + heightPadding);
      }
      if ($gameParty.inLockedActorList(actor.actorId())){
        this.drawLockedIcon(index, width, height); 
      }
    } else {
      const actor = this.actor(index);
      const rect = this.itemRect(index);
      const width = (_menuActorDisplayCount === 5) ? 124 : ImageManager.standardFaceWidth;
      const height = rect.height - 2;
      const heightPadding = (this.numVisibleRows() === 4) ? 0 : 8;
      //this.changePaintOpacity(actor.isBattleMember());
      if ($gameSystem.isSRPGMode() && (actor.srpgTurnEnd() === true || actor.isRestricted() === true)) {
        this.changePaintOpacity(false);
      } else {
        this.changePaintOpacity(true);
      }
      if (_menuActorGraphicType === 1) {
        this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
      } else if (_menuActorGraphicType === 2) {
        this.drawActorCharacter(actor, rect.x + width / 2, rect.y + height * 0.7 + heightPadding);
      } else if (_menuActorGraphicType === 3) {
        this.drawActorBattler(actor, rect.x + width / 2, rect.y + height * 0.75 + heightPadding);
      }
    }
  };

  Window_MenuStatus.prototype.drawItemStatus = function(index) {
    const actor = this.actor(index);
    const rect = this.itemRect(index);
    switch (_menuActorDisplayCount) {
      case 1:
        var x = rect.x + 180;
        var y = rect.y + Math.floor(rect.height / 2 - this.lineHeight() * 1.5);
        this.drawActorSimpleStatus(actor, x, y);
        break;
      case 2:
        var x = rect.x + 180;
        var y = rect.y;
        this.drawActorSimpleStatus6(actor, x, y);
        break;
      case 3:
        var x = rect.x;
        var y = rect.y + 2;
        this.drawActorSimpleStatus8(actor, x, y);
        break;
      case 4:
        var x = rect.x;
        var y = rect.y;
        this.drawActorSimpleStatus12(actor, x, y);
        break;
      case 5:
        var x = rect.x;
        var y = rect.y + 2;
        this.drawActorSimpleStatus16(actor, x, y);
        break;
    }
};

Window_MenuStatus.prototype.drawLockedIcon = function(index, width, height) {
  const rect = this.itemRect(index);
  const iconHeight = ImageManager.iconWidth;
  switch (_menuActorDisplayCount) {
    case 1:
      this.drawIcon(_lockIconIndex, rect.x + width - iconHeight, rect.y + height - iconHeight);
      break;
    case 2:
      this.drawIcon(_lockIconIndex, rect.x + width - iconHeight, rect.y + height - iconHeight);
      break;
    case 3:
      this.drawIcon(_lockIconIndex, rect.x + width - iconHeight - 10, rect.y + height - iconHeight * 2 - 6);
      break;
    case 4:
      this.drawIcon(_lockIconIndex, rect.x + width - iconHeight - 12, rect.y + height - iconHeight * 2 + 4);
      break;
    case 5:
      this.drawIcon(_lockIconIndex, rect.x + 4, rect.y + height - iconHeight);
      break;
  }
};

})();
