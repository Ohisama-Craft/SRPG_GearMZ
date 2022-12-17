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
*
* @help
* My (RyanBram) simple plugin for adjusting RPG Maker MV UI (menu)
* to make it more unique for SRPG Battle
* edited by Shoukang to support battlePrepare plugin compatibility
* and modified by OhisamaCraft
*/

/*:ja
* @target MZ
* @plugindesc SRPG戦闘でのメニュー画面の変更(Shoukang, おひさまクラフトによる改変あり)
* @author SRPG Team
*
* @help
* RyanBram氏による、メニュー画面をSRPGバトル向けUIに変更するプラグイン
* Shoukang氏のbattlePrepare pluginとの競合対策あり
* おひさまクラフトによる改変あり
*/


(function () {
  'use strict';

  const switchId = 1;

  const _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
  Scene_Menu.prototype.createCommandWindow = function() {
    _Scene_Menu_createCommandWindow.call(this);
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._commandWindow.height = this._commandWindow.fittingHeight(this._commandWindow.maxItems());
      this._commandWindow.x = (Graphics.boxWidth - this._commandWindow.width)/2;
      this._commandWindow.y = (Graphics.boxHeight - this._commandWindow.height)/2; // 150
    }
  };

  const _Scene_Menu_createStatusWindow = Scene_Menu.prototype.createStatusWindow;
  Scene_Menu.prototype.createStatusWindow = function() {
    _Scene_Menu_createStatusWindow.call(this);
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._statusWindow.x = (Graphics.boxWidth - this._statusWindow.width)/2;
      this._statusWindow.hide();
      this._goldWindow.hide();
    }
  };

  const _Scene_Menu_commandPersonal = Scene_Menu.prototype.commandPersonal;
  Scene_Menu.prototype.commandPersonal = function () {
    _Scene_Menu_commandPersonal.call(this);
    this.showStatusAndHideCommand();
  };

  const _Scene_Menu_commandFormation = Scene_Menu.prototype.commandFormation;
  Scene_Menu.prototype.commandFormation = function () {
    _Scene_Menu_commandFormation.call(this);
    this.showStatusAndHideCommand();
  };

// ==============================================================================
// REMOVE MENU COMMAND ----------------------------------------------------------
// ==============================================================================

  const _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
  Window_MenuCommand.prototype.addMainCommands = function() {
    if ($gameSystem.isSRPGMode()) {
      this.addCommand(TextManager.status, 'status', this.areMainCommandsEnabled());
    } else {
      _Window_MenuCommand_addMainCommands.call(this);
    }
  };

  const _Window_MenuCommand_addFormationCommand = Window_MenuCommand.prototype.addFormationCommand;
  Window_MenuCommand.prototype.addFormationCommand = function() {
    if (!$gameSystem.isSRPGMode()) {
      _Window_MenuCommand_addFormationCommand.call(this);
    }
  };

// REMOVE MENU COMMAND ----------------------------------------------------------

/*
// ==============================================================================
// REMOVE MENU COMMAND ----------------------------------------------------------
// ==============================================================================
Window_MenuCommand.prototype.addMainCommands = function() {
    var enabled = this.areMainCommandsEnabled();
    if (this.needsCommand('item') && !$gameSwitches.value(switchId)) {
        this.addCommand(TextManager.item, 'item', enabled);
    }
    if (this.needsCommand('skill')  && !$gameSwitches.value(switchId)) {
        this.addCommand(TextManager.skill, 'skill', enabled);
    }
    if (this.needsCommand('equip')  && !$gameSwitches.value(switchId)) {
        this.addCommand(TextManager.equip, 'equip', enabled);
    }
    if (this.needsCommand('status')  && !$gameSwitches.value(switchId)) {
        this.addCommand(TextManager.status, 'status', enabled);
    }  else {
        this.addCommand("Units", 'status', enabled);
    }
  };

Window_MenuCommand.prototype.addFormationCommand = function() {
    var enabled = this.isFormationEnabled();
    if (this.needsCommand('formation') && !$gameSwitches.value(switchId)) {
        this.addCommand(TextManager.formation, 'formation', enabled);
    }
  }; 
// REMOVE MENU COMMAND ----------------------------------------------------------
*/

// ==============================================================================
// CHANGE SRPG Movement Indicator -----------------------------------------------
// ==============================================================================

    Sprite_SrpgMoveTile.prototype.createBitmap = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth - 4, tileHeight - 4);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = 1;
    };

    Sprite_SrpgMoveTile.prototype.updateAnimation = function() {
        this._frameCount++;
        this._frameCount %= 20;
        this.opacity = (60 - this._frameCount) * 3;
    };
// CHANGE SRPG Movement Indicator -----------------------------------------------

// ==============================================================================
// CHANGE SRPG Battle Prediciton Width ------------------------------------------
// ==============================================================================

    /*

    Window_SrpgPrediction.prototype.windowWidth = function() {
        return 816;
    };

    Window_SrpgStatus.prototype.windowWidth = function() {
        return 408;
    };

    Scene_Map.prototype.createSrpgStatusWindow = function() {
        this._mapSrpgStatusWindow = new Window_SrpgStatus(0, 0);
        this._mapSrpgStatusWindow.x = Graphics.boxWidth - ((Graphics.boxWidth - 816) / 2) - this._mapSrpgStatusWindow.windowWidth();
        this._mapSrpgStatusWindow.openness = 0;
        this.addWindow(this._mapSrpgStatusWindow);
    };

    Scene_Map.prototype.createSrpgTargetWindow = function() {
        this._mapSrpgTargetWindow = new Window_SrpgStatus((Graphics.boxWidth-816)/2, 0);
        this._mapSrpgTargetWindow.openness = 0;
        this.addWindow(this._mapSrpgTargetWindow);
    };

    Scene_Map.prototype.createSrpgPredictionWindow = function() {
        this._mapSrpgPredictionWindow = new Window_SrpgPrediction((Graphics.boxWidth-816)/2, 0);
        this._mapSrpgPredictionWindow.y = this._mapSrpgStatusWindow.windowHeight();
        this._mapSrpgPredictionWindow.openness = 0;
        this.addWindow(this._mapSrpgPredictionWindow);
    };

    */

// CHANGE SRPG Battle Prediciton Width ------------------------------------------

// ==============================================================================
// Window Opacity ---------------------------------------------------------------
// ==============================================================================
// Window_Base.prototype.standardBackOpacity = function() {
//     return 255;
// };
// Window Opacity ---------------------------------------------------------------


  const _Scene_Menu_onPersonalCancel = Scene_Menu.prototype.onPersonalCancel;
  Scene_Menu.prototype.onPersonalCancel = function () {
    _Scene_Menu_onPersonalCancel.call(this);
    this.showCommandAndHideStatus();
  };

  const _Scene_Menu_onFormationCancel = Scene_Menu.prototype.onFormationCancel;
  Scene_Menu.prototype.onFormationCancel = function () {
    _Scene_Menu_onFormationCancel.call(this);
    this.showCommandAndHideStatus();
  };

  Scene_Menu.prototype.showStatusAndHideCommand = function () {
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._commandWindow.hide();
      this._statusWindow.show();
    }
  };

  Scene_Menu.prototype.showCommandAndHideStatus = function () {
    if ($gameSystem.isSRPGMode() && $gameSystem.isBattlePhase() !== 'battle_prepare') {
      this._commandWindow.show();
      this._statusWindow.hide();
    }
  };
})();