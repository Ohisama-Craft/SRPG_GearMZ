//-----------------------------------------------------------------------------
// SRPG_MouseOperation_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================
/*:
@plugindesc SRPG mouse operation improvements, modified by OhisamaCraft
@author SRPG Team
@target MZ

@param borderMoveSettings
@text Border Scroll Settings

@param borderSwitch
@text Border Scroll Switch
@desc Switch that need to turn on to activate the border scroll feature OUTSIDE SRPG Mode. set to 0 to ONLY active at SRPG Mode.
@type switch
@parent borderMoveSettings
@default 0

@param borderDistance1
@text Border Distance 1
@desc Distance to the border before camera scrolls Slowly
@type Number
@parent borderMoveSettings
@default 55

@param scrollSpeed1
@text Scroll Speed 1
@desc Speed of the scroll when mouse at border distance 1
@type Number
@parent borderMoveSettings
@default 3.5

@param useSecondSpeed
@text Two Phase Speed
@desc True -> will have different speed the closer to the border. False -> use one speed
@type boolean
@parent borderMoveSettings
@default true

@param borderDistance2
@text Border Distance 2
@desc Distance to the border before camera scrolls Faster. Must be lower than border distance 1
@type Number
@parent borderMoveSettings
@default 15

@param scrollSpeed2
@text Scroll Speed 2
@desc Speed of the scroll when mouse at border distance 2
@type Number
@parent borderMoveSettings
@default 5.5

@param dragScrollSettings
@text Drag Scroll Settings

@param dragSwitch
@text Drag Scroll Switch
@desc Switch that need to turn on to make the drag map with middle click feature ON. set to 0 to DISABLE THIS FEATURE.
@type switch
@parent dragScrollSettings
@default 0

@param dragSpeed
@text Drag Scroll Speed
@desc Speed of the drag scroll. higher number = faster. ideal value 2 - 4
@type Number
@parent dragScrollSettings
@default 2

@param cursorFollowMouse
@text Cursor Follow Mouse Settings

@param isCursorFollowMouse
@text Cursor Follow Mouse?
@desc true -> cursor will follow mouse in SRPG mode, false -> cursor move with mouse click
@type boolean
@parent cursorFollowMouse
@default true

@param useCenteringFeature
@text Center Move / Target
@desc true -> center to cursor when moving actor and choosing target, false -> disable it.
@type boolean
@parent cursorFollowMouse
@default true

@param centerCameraDelay
@text Center Camera Delay
@desc Delay for the cursor centering to player. value [100 - 4000]. Recommended 1000
@type Number
@max 4000
@min 100
@parent cursorFollowMouse
@default 800

@param wheelSettings
@text Mouse Wheel Settings

@param isWheelPrevNext
@text Wheel -> Next Actor
@desc true -> when wheel scrolled trigger Prev / Next Actor,       false -> mouse wheel did not do anything
@type boolean
@parent wheelSettings
@default true

@param isWheelCenter
@text Next Actor -> Centered
@desc true -> when prev / next actor triggered. center Actor, false -> mouse wheel did not do anything
@type boolean
@parent wheelSettings
@default true

@help
 * Copyright (c) 2020 SRPG team. All rights reserved.
 * Released under the MIT license.
 * ===================================================================
 ■ Information      ╒══════════════════════════╛
 SRPG Mouse Operation
 Version: 1.1
 By SRPG Team, Ohisama Craft

 ■ Introduction     ╒══════════════════════════╛
 This plugin is Mouse Operation for SRPG 

 ■ Features         ╒══════════════════════════╛
 - Border Scroll -> scroll camera when mouse nearing screen border
 - Drag Scroll -> drag camera when holding middle mouse click
 - SRPG Cursor Follow Mouse Movement
 - Use mouse wheel to select remaining actors

  ■ Changelog       ╒══════════════════════════╛
 v1.1 2023.8.17            modified by OhisamaCraft
 v1.0 2020.11.09           Finish the plugin

 ■ Plugin Download ╒══════════════════════════╛
 v1.0 https://www.dropbox.com/s/4uep2mwnwnxwd2c/SRPG_Mouse_Operation.js?dl=0
 v1.1 https://github.com/Ohisama-Craft

 ■ Screenshots ╒══════════════════════════╛
 Coming Soon
  
 ■ Demo ╒══════════════════════════╛
 https://ohisamacraft.nyanta.jp/index.html

 ■ How to use       ╒══════════════════════════╛
 1. Place this plugin with this order:
 SRPG_core.js
 SRPG_UX_Cursor.js
 SRPG_AOE.js
 SRPG_ShowPath.js
 <<<<<  this plugin [SRPG_Mouse_Operation.js]

 2. set the plugin parameter.
      ~ [optional] set the switch id to activate the borderScroll OUTSIDE the SRPG mode
      ~ [optional] set the switch id to activate the dragScroll
      ~ set the delay of the cursor movement (0 is the best in my opinion)

 3. turn ON the switch with event command to activate the borderScroll Outside the SRPG mode.
    the borderScroll will automatically active when SRPG Mode activate.

 ■ Dependencies     ╒══════════════════════════╛
 SRPG_core.js
 SRPG_UX_Cursor.js
 SRPG_ShowPath.js
 SRPG_AOE.js

 ■ Compatibility    ╒══════════════════════════╛
 it should be compatible with most things.
 this plugin not compatible with EST_STRATEGY_MOUSE_CAM.js
 because this is Fork Version from that plugin thus most of the code
 already included in this plugin... using both might mess the aliased method.

 ■ Parameters       ╒══════════════════════════╛
  >> Border Scroll Switch
      ~ Switch that need to turn on to activate border scroll feature OUTSIDE SRPG MODE. set to 0 to ONLY work for SRPG MODE.
  >> Border Distance 1
      ~ Distance to the border before camera scrolls Slowly
  >> Scroll Speed 1
      ~ Speed of the scroll when mouse at border distance 1
  >> Two Phase Speed
      ~ True -> will have different speed the closer to the border. 
        False -> use one speed
  >> Border Distance 2
      ~ Distance to the border before camera scrolls Faster. Must be lower than border distance 1
  >> Scroll Speed 2
      ~ Speed of the scroll when mouse at border distance 2
  >> Drag Scroll Switch
      ~ Switch that need to turn on to activate the drag map with middle click feature. set to 0 to DISABLE THIS FEATURE.
  >> Drag Scroll Speed
      ~ Speed of the drag scroll. higher number = faster. ideal value 2 - 4
  >> Cursor Follow Switch
    ~ Switch that need to turn on to make the cursor follow mouse movement. set to 0 to always ON.
  >> Cursor Follow Delay
    ~ Delay for the cursor following mouse movement...
 
 ■ Extra Credit ╒══════════════════════════╛
 Estriole for EST_STRATEGY_MOUSE_CAM.js plugin code
 (with permission to be used as part of SRPG Project)
*/

var EST = EST || {};
EST.SRPGMouseOperation = EST.SRPGMouseOperation || {};
EST.SRPGMouseOperation.pluginName="SRPG_MouseOperation_MZ";

// マウスの表示・非表示の切り替え modified by OhisamaCraft
// 参考：トリアコンタン様のMousePointerExtend.js
//=============================================================================
// Graphics
//=============================================================================
    Graphics._PointerType   = 'auto';
    Graphics._hiddenPointer = true;

    Graphics.setHiddenPointer = function(value) {
        this._hiddenPointer = !!value;
        this.updateMousePointer();
    };

    Graphics.updateMousePointer = function() {
      document.body.style.cursor = this._hiddenPointer ? 'none' : this._PointerType;
    };

/// est strategy mouse cam plugin code part ///
(function($){
//grabbing plugin parameter
$.Parameters = PluginManager.parameters($.pluginName);
$.Parameters.borderDistance1 = Number($.Parameters.borderDistance1);
$.Parameters.scrollSpeed1 = Number($.Parameters.scrollSpeed1);
//$.Parameters.useSecondSpeed = JSON.parse($.Parameters.useSecondSpeed);
$.Parameters.useSecondSpeed = $.Parameters.useSecondSpeed || 'true';
$.Parameters.borderDistance2 = Number($.Parameters.borderDistance2);
$.Parameters.scrollSpeed2 = Number($.Parameters.scrollSpeed2);
$.Parameters.dragSpeed = Number($.Parameters.dragSpeed);
$.Parameters.borderSwitch = Number($.Parameters.borderSwitch);
$.Parameters.dragSwitch = Number($.Parameters.dragSwitch);
//game system for switches
// if no switch set -> only work at SRPG mode
// if a switch set -> work at SRPG mode OR when the switch ON
Game_System.prototype.isBorderScroll = function() {
    if($.Parameters.borderSwitch <= 0) return this.isSRPGMode();
    return this.isSRPGMode() || $gameSwitches.value($.Parameters.borderSwitch);
};

// isdragscroll method to suit SRPG -> when no switch set -> never activate
Game_System.prototype.isDragScroll = function() {
    if($.Parameters.dragSwitch <= 0) return false;
    return $gameSwitches.value($.Parameters.dragSwitch);
};

$.Game_Map_updateScroll = Game_Map.prototype.updateScroll;
Game_Map.prototype.updateScroll = function() {
  $.Game_Map_updateScroll.call(this);
  if (this.isScrolling()) return;
  if ($gameSystem.isBorderScroll()) this.updateScrollAtBorder();
  if ($gameSystem.isDragScroll()) this.updateScrollAtDrag();
  this.updateSRPGCursorCenter();
};

Game_Map.prototype.updateScrollAtBorder = function() {
    // modified by OhisamaCraft
    if (TouchInput.inButtonArea()) return;
    this._scrollSpeed = $.Parameters.scrollSpeed1;
    if (TouchInput.atLeftBorder()) var dir = 4; //left
    if (TouchInput.atRightBorder()) var dir = 6; //right
    if (TouchInput.atTopBorder()) var dir = 8; //up
    if (TouchInput.atBottomBorder()) var dir = 2; //down
    if (TouchInput.atLeftBorder() && TouchInput.atTopBorder()) var dir = 7; //upleft
    if (TouchInput.atRightBorder() && TouchInput.atTopBorder()) var dir = 9; //upright
    if (TouchInput.atLeftBorder() && TouchInput.atBottomBorder()) var dir = 1; //downleft
    if (TouchInput.atRightBorder() && TouchInput.atBottomBorder()) var dir = 3; //downright
    if($.Parameters.useSecondSpeed === 'true'){
      if (TouchInput.atDeepLeftBorder()) this._scrollSpeed = $.Parameters.scrollSpeed2; //deepleft
      if (TouchInput.atDeepRightBorder()) this._scrollSpeed = $.Parameters.scrollSpeed2; //deepright
      if (TouchInput.atDeepTopBorder()) this._scrollSpeed = $.Parameters.scrollSpeed2; //deepup
      if (TouchInput.atDeepBottomBorder()) this._scrollSpeed = $.Parameters.scrollSpeed2;; //deepdown
    };
    if(dir) this.doScroll(dir, this.scrollDistance());
};

$.Game_Map_doScroll = Game_Map.prototype.doScroll;
Game_Map.prototype.doScroll = function(direction, distance) {
    $.Game_Map_doScroll.call(this,direction,distance);
    switch (direction) {
    case 7:
        this.scrollUpLeft(distance);
        break;
    case 9:
        this.scrollUpRight(distance);
        break;
    case 1:
        this.scrollDownLeft(distance);
        break;
    case 3:
        this.scrollDownRight(distance);
        break;
    }
};

Game_Map.prototype.scrollUpLeft = function(distance) {
    this.scrollUp(distance);
    this.scrollLeft(distance);
};
Game_Map.prototype.scrollUpRight = function(distance) {
    this.scrollUp(distance);
    this.scrollRight(distance);
};
Game_Map.prototype.scrollDownLeft = function(distance) {
    this.scrollDown(distance);
    this.scrollLeft(distance);
};
Game_Map.prototype.scrollDownRight = function(distance) {
    this.scrollDown(distance);
    this.scrollRight(distance);
};

//=============================================================================
// Input
//=============================================================================
var _MO_Input_update = Input.update;
Input.update = function() {
    var oldDate = this.date;
    _MO_Input_update.apply(this, arguments);
    if (this.date !== oldDate) Graphics.setHiddenPointer(true);
};

//=============================================================================
// TouchInput
//=============================================================================
$.TouchInput_onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
  $.TouchInput_onMouseMove.call(this,event);
  this._mouseX = Graphics.pageToCanvasX(event.pageX);
  this._mouseY = Graphics.pageToCanvasY(event.pageY);
  Graphics.setHiddenPointer(false);
};

TouchInput.atLeftBorder = function(){
  if(this._mouseX < $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atRightBorder = function(){
  if(this._mouseX > Graphics.boxWidth - $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atTopBorder = function(){
  if(this._mouseY < $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atBottomBorder = function(){
  if(this._mouseY > Graphics.boxHeight - $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atDeepLeftBorder = function(){
  if(this._mouseX < $.Parameters.borderDistance2) return true;
  return false;
};

TouchInput.atDeepRightBorder = function(){
  if(this._mouseX > Graphics.boxWidth - $.Parameters.borderDistance2) return true;
  return false;
};

TouchInput.atDeepTopBorder = function(){
  if(this._mouseY < $.Parameters.borderDistance2) return true;
  return false;
};

TouchInput.atDeepBottomBorder = function(){
  if(this._mouseY > Graphics.boxHeight - $.Parameters.borderDistance2) return true;
  return false;
};

//modified by OhisamaCraft
TouchInput.inButtonArea = function(){
  if (!ConfigManager.touchUI) return false;
  if (this._mouseX > (Graphics.boxWidth - 48 - 4) && this._mouseY < (48 + 4)) return true;
  return false;
};

//drag camera feature
$.TouchInput_onMiddleButtonDown = TouchInput._onMiddleButtonDown
TouchInput._onMiddleButtonDown = function(event) {
  $.TouchInput_onMiddleButtonDown.call(this,event);
  this._middleButtonDown = true;
};

$.TouchInput_onMouseUp = TouchInput._onMouseUp;
TouchInput._onMouseUp = function(event) {
  $.TouchInput_onMouseUp.call(this,event);
  if(event.button === 1) this._middleButtonDown = false;
  if($gameMap) $gameMap._oldMouseX = null;
  if($gameMap) $gameMap._oldMouseY = null;
};

Game_Map.prototype.updateScrollAtDrag = function() {
  if(!TouchInput._middleButtonDown) return;
  if(this._oldMouseX && this._oldMouseX !== TouchInput._mouseX){
    var difX = (this._oldMouseX - TouchInput._mouseX) * Math.pow(2, $.Parameters.dragSpeed) / 256;
    difX > 0 ? this.scrollRight(difX) : this.scrollLeft(-difX);
  }
  if(this._oldMouseY && this._oldMouseY !== TouchInput._mouseY){
    var difY = (this._oldMouseY - TouchInput._mouseY) * Math.pow(2, $.Parameters.dragSpeed) / 256;
    difY > 0 ? this.scrollDown(difY) : this.scrollUp(-difY); 
  }
  this._oldMouseX = TouchInput._mouseX; 
  this._oldMouseY = TouchInput._mouseY;
};
/// end est strategy mouse cam plugin code part ///

//srpg cursor patch part
//grabbing plugin parameter
$.Parameters = PluginManager.parameters($.pluginName);
$.Parameters.isCursorFollowMouse = JSON.parse($.Parameters.isCursorFollowMouse);
//$.Parameters.cursorFollowDelay = Number($.Parameters.cursorFollowDelay);
$.Parameters.centerCameraDelay = Number($.Parameters.centerCameraDelay);
$.Parameters.useCenteringFeature = JSON.parse($.Parameters.useCenteringFeature);
$.Parameters.isWheelPrevNext = JSON.parse($.Parameters.isWheelPrevNext);
$.Parameters.isWheelCenter = JSON.parse($.Parameters.isWheelCenter);

Game_System.prototype.isPlayerFollowMouse = function() {
  return this.isSRPGMode() && $.Parameters.isCursorFollowMouse;
};

// SRPG PATCH
// player follow mouse (emulate cursor)
// modified by OhisamaCraft
/*
$.Game_Map_updateScroll_followMouse = Game_Map.prototype.updateScroll;
Game_Map.prototype.updateScroll = function() {
  $.Game_Map_updateScroll_followMouse.call(this);
  if ($gameSystem.isPlayerFollowMouse()) this.updatePlayerFollowMouse();
};

Game_Map.prototype.updatePlayerFollowMouse = function() {
  if (this._interpreter.isRunning()) return;
  if (Graphics._hiddenPointer) return;
  if ($gameSystem._isBattlePhase !== 'actor_phase') return;
  if ($gameSystem.isSubBattlePhase() === 'initialize') return;
  if ($gameSystem.isSubBattlePhase() === 'normal') return this._flagInvokeActionStart = false;
  if ($gameSystem.isSubBattlePhase() === 'status_window') return;
  if ($gameSystem.isSubBattlePhase() === 'actor_command_window') return this._flagWarpCursorSRPG = false;
  if ($gameSystem.isSubBattlePhase() === 'battle_window') return;
  if ($gameSystem.isSubBattlePhase() === 'invoke_action') this._flagInvokeActionStart = true;
  if ($gameSystem.isSubBattlePhase() === 'actor_move') $gameTemp.clearDestination();
  if (this._flagInvokeActionStart) return;
  this._followMouseCounter = this._followMouseCounter || 0;
  this._followMouseCounter ++;
  if(this._followMouseCounter < $.Parameters.cursorFollowDelay) return;
  this._followMouseCounter = 0;
  var x = $gameMap.canvasToMapX(TouchInput.x);
  var y = $gameMap.canvasToMapY(TouchInput.y);
  if ($gameSystem.isSubBattlePhase() === 'actor_target' && !this._flagWarpCursorSRPG){
    $gamePlayer.setPosition(x, y);
    $gamePlayer.updateMove();
    this._flagWarpCursorSRPG = true;
  }
  if($gamePlayer.x !== x || $gamePlayer.y !== y) $gamePlayer.moveStraight($gamePlayer.findDirectionTo(x, y))
  //patch for show path dan AOE
  if ($gameSystem.isSubBattlePhase() === 'actor_target' && $gameSystem.positionInRange(x, y)) $gameTemp.showArea(x, y);
  if(!$gameTemp.activeEvent()) return;
  if($gameSystem.isSubBattlePhase() === 'actor_move') $gameTemp.showRoute(x, y);
};
*/

  var _SRPG_MO_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
  Game_Player.prototype.moveByInput = function() { 
    if ($gameSystem.isSRPGMode() === true && $gameSystem.isPlayerFollowMouse() &&
        !this.isMoving() && this.canMove() && !Graphics._hiddenPointer) {
          var x = $gameMap.canvasToMapX(TouchInput._mouseX);
          var y = $gameMap.canvasToMapY(TouchInput._mouseY);
          if ($gamePlayer.x !== x || $gamePlayer.y !== y) {
            $gamePlayer.setPosition(x, y);
            //patch for show path dan AOE
            if ($gameSystem.isSubBattlePhase() === 'actor_target' && $gameSystem.positionInRange(x, y)) {
              $gameTemp.showArea(x, y);
            } else if ($gameSystem.isSubBattlePhase() !== 'invoke_action' &&
                       $gameSystem.isSubBattlePhase() !== 'battle_window' && $gameSystem.isBattlePhase() == 'actor_phase') {
              $gameTemp.clearArea();
            }
            if(!$gameTemp.activeEvent()) return;
            if($gameSystem.isSubBattlePhase() === 'actor_move') $gameTemp.showRoute(x, y);
          }
    }
    _SRPG_MO_Game_Player_moveByInput.call(this);
  };

$.Game_Player_updateScroll = Game_Player.prototype.updateScroll;
Game_Player.prototype.updateScroll = function(lastScrolledX, lastScrolledY) {
  if ($gameSystem.isPlayerFollowMouse() && 
      ($gameSystem._isBattlePhase == 'actor_phase' || $gameSystem.isBattlePhase() === 'battle_prepare') &&
      !$gameMap._interpreter.isRunning() && !Graphics._hiddenPointer) return;
  $.Game_Player_updateScroll.call(this, lastScrolledX, lastScrolledY);
};

//border scroll feature stop when in srpg subbattlephase
$.Game_Map_updateScrollAtBorder_SRPGPatch = Game_Map.prototype.updateScrollAtBorder;
Game_Map.prototype.updateScrollAtBorder = function() {
  if (this._interpreter.isRunning()) return;
  if (Graphics._hiddenPointer) return;
  if ($gameSystem.isBattlePhase() === 'auto_actor_phase') return;
  if ($gameSystem.isBattlePhase() === 'enemy_phase') return;
  if ($gameSystem.isSubBattlePhase() === 'status_window') return;
  if ($gameSystem.isSubBattlePhase() === 'actor_command_window') return;
  if ($gameSystem.isSubBattlePhase() === 'battle_window') return;
  if ($gameSystem.isSubBattlePhase() === 'invoke_action') return;
  if ($gameSystem.isSubBattlePhase() === 'normal' && !this._flagSRPGNormalPhaseCenterOnce && $.Parameters.useCenteringFeature) return;
  $.Game_Map_updateScrollAtBorder_SRPGPatch.call(this);
};

$.Game_Map_updateScrollAtDrag_SRPGPatch = Game_Map.prototype.updateScrollAtDrag;
Game_Map.prototype.updateScrollAtDrag = function() {
  if (this._interpreter.isRunning()) return;
  if (Graphics._hiddenPointer) return;
  if ($gameSystem.isBattlePhase() === 'auto_actor_phase') return;
  if ($gameSystem.isBattlePhase() === 'enemy_phase') return;
  if ($gameSystem.isSubBattlePhase() === 'status_window') return;
  if ($gameSystem.isSubBattlePhase() === 'actor_command_window') return;
  if ($gameSystem.isSubBattlePhase() === 'battle_window') return;
  if ($gameSystem.isSubBattlePhase() === 'invoke_action') return;
  if ($gameSystem.isSubBattlePhase() === 'normal' && !this._flagSRPGNormalPhaseCenterOnce && $.Parameters.useCenteringFeature) return;
  $.Game_Map_updateScrollAtDrag_SRPGPatch.call(this);
};

Game_Map.prototype.updateSRPGCursorCenter = function() {
  if ($gameSystem.isSubBattlePhase() === 'actor_command_window' && $.Parameters.useCenteringFeature) this.camCenterTo($gamePlayer);
  if ($gameSystem.isSubBattlePhase() === 'battle_window' && $.Parameters.useCenteringFeature) this.camCenterTo($gamePlayer);
  if ($gameSystem.isSubBattlePhase() === 'invoke_action') this.camCenterTo($gamePlayer);
  if ($gameSystem.isSubBattlePhase() === 'actor_move') this._flagSRPGNormalPhaseCenterOnce = false;
  if ($gameSystem.isSubBattlePhase() === 'normal'){
    if(!this._flagSRPGNormalPhaseCenterOnce) {
      this.camCenterTo($gamePlayer);
    };
    if(this.isSRPGCamCenterStopMoving(this._oldSRPGScreenCheckX, this._oldSRPGScreenCheckY, $gamePlayer)){
      this._flagSRPGNormalPhaseCenterOnce = true;
      this._oldSRPGScreenCheckX = false;
      this._oldSRPGScreenCheckY = false;
    } 
    this._oldSRPGScreenCheckX = this._displayX
    this._oldSRPGScreenCheckY = this._displayY
  }
};

Game_Map.prototype.isSRPGCamCenterStopMoving = function(oldX, oldY, obj) {
  if ($gamePlayer.isMoving()) return false;
  if (oldX == this._displayX && oldY == this._displayY) return true;
  return false;
};

Game_Map.prototype.camCenterTo = function(obj, delay) {
    var camDelay = delay || $.Parameters.centerCameraDelay; 
    var cw = Graphics.width / 2;
    var ch = Graphics.height / 2;
    var sx = obj.screenX();
    var sy = obj.screenY();
    var mx = Math.abs(sx - cw) / camDelay;
    var my = Math.abs(sy - ch) / camDelay;
    if (mx < 0.01) mx = 0;
    if (my < 0.01) my = 0;
    if (sx < cw) this.scrollLeft(mx);
    if (sx > cw) this.scrollRight(mx);
    if (sy < ch) this.scrollUp(my);   
    if (sy > ch) this.scrollDown(my);
};

$TouchInput_onWheel = TouchInput._onWheel;
TouchInput._onWheel = function(event) {
  $TouchInput_onWheel.call(this, event);
  if (!$.Parameters.isWheelPrevNext) return;
  if ($gameSystem.isSubBattlePhase() !== 'normal') return;
  if ($gamePlayer && $gamePlayer.isMoving()) return;
  if(this._newState.wheelY > 0){
    SoundManager.playCursor();
    $gameSystem.getNextRActor();
  }; 
  if(this._newState.wheelY < 0) {
    SoundManager.playCursor();
    $gameSystem.getNextLActor();
  };
};

$.Game_System_getNextRActor = Game_System.prototype.getNextRActor;
Game_System.prototype.getNextRActor = function() {
  $.Game_System_getNextRActor.call(this);
  if(!$.Parameters.isWheelCenter) return;
  $gameMap._flagSRPGNormalPhaseCenterOnce = false;  
  $gameMap._oldSRPGScreenCheckX = false;
  $gameMap._oldSRPGScreenCheckY = false;
};

$.Game_System_getNextLActor = Game_System.prototype.getNextLActor;
Game_System.prototype.getNextLActor = function() {
  $.Game_System_getNextLActor.call(this);
  if(!$.Parameters.isWheelCenter) return;
  $gameMap._flagSRPGNormalPhaseCenterOnce = false;
  $gameMap._oldSRPGScreenCheckX = false;
  $gameMap._oldSRPGScreenCheckY = false;
};


})(EST.SRPGMouseOperation);
