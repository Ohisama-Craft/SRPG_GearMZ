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

/*:ja
@plugindesc SRPGでのマウス操作を改善します（おひさまクラフトによる改変）。
@author SRPG Team
@target MZ

@param borderMoveSettings
@text 境界スクロール設定

@param borderSwitch
@text 境界スクロールスイッチ
@desc SRPG戦闘外で境界スクロールを有効化するためのスイッチID。SRPG戦闘でのみ有効にする場合は0に設定してください。
@type switch
@parent borderMoveSettings
@default 0

@param borderDistance1
@text 境界距離1
@desc カメラスクロールがゆっくりになる前の、境界までの距離。
@type Number
@parent borderMoveSettings
@default 55

@param scrollSpeed1
@text スクロール速度1
@desc マウスが境界距離1にあるときのスクロールの速度。
@type Number
@parent borderMoveSettings
@default 3.5

@param useSecondSpeed
@text 2フェイズ速度
@desc trueの場合：境界に近づくと速度が変わります。falseの場合：速度は変わりません。
@type boolean
@parent borderMoveSettings
@default true

@param borderDistance2
@text 境界距離2
@desc カメラスクロールが早くなる前の、境界までの距離。境界距離1よりも小さい値にする必要があります。
@type Number
@parent borderMoveSettings
@default 15

@param scrollSpeed2
@text 境界速度2
@desc マウスが境界距離2にあるときのスクロールの速度。
@type Number
@parent borderMoveSettings
@default 5.5

@param dragScrollSettings
@text ドラッグスクロール設定

@param dragSwitch
@text ドラッグスクロールスイッチ
@desc 中クリックが有効な場合に、マップのドラッグの有効化のためのスイッチ。この機能を無効にする場合、0にしてください。
@type switch
@parent dragScrollSettings
@default 0

@param dragSpeed
@text ドラッグスクロール速度
@desc ドラッグスクロールの速度。高いほど早いです。2～4を推奨します。
@type Number
@parent dragScrollSettings
@default 2

@param cursorFollowMouse
@text カーソル追跡マウス設定

@param isCursorFollowMouse
@text カーソルをマウスに追跡させるか
@desc trueの場合、SRPG戦闘にてカーソルがマウスを追跡します。falseの場合、カーソルはマウスクリックによって移動します。
@type boolean
@parent cursorFollowMouse
@default true

@param useCenteringFeature
@text 移動/ターゲットセンタリング
@desc trueの場合、アクター移動時と対象選択時にカーソルによるセンタリングが有効になります。falseの場合、無効になります。
@type boolean
@parent cursorFollowMouse
@default true

@param centerCameraDelay
@text センタリング時カメラディレイ
@desc プレイヤーへのカーソルセンタリングのディレイ値。100～4000の間で設定できます。推奨は1000です。
@type Number
@max 4000
@min 100
@parent cursorFollowMouse
@default 800

@param wheelSettings
@text マウスホイール設定

@param isWheelPrevNext
@text ホイール→次アクター
@desc trueの場合、ホイールによる次/直前アクター切り替えが有効になります。falseの場合、ホイールによる切り替えは行われません。
@type boolean
@parent wheelSettings
@default true

@param isWheelCenter
@text 次アクター→センタリング
@desc trueの場合、ホイールによるアクター切り替え時にセンタリングされます。falseの場合、センタリングされません。
@type boolean
@parent wheelSettings
@default true

@help
 * Copyright (c) 2020 SRPG team. All rights reserved.
 * Released under the MIT license.
 * ===================================================================
 ■ 情報      ╒══════════════════════════╛
 SRPG Mouse Operation
 Version: 1.1
 By SRPG Team, Ohisama Craft

 ■ 概要     ╒══════════════════════════╛
 本プラグインはSRPG用のマウス操作機能を提供します。 

 ■ 機能         ╒══════════════════════════╛
 - 境界スクロール→マウスが画面境界（端）に近いとき、カメラがスクロールします。
 - ドラッグスクロール→マウス中クリック時、カメラをドラッグします。
 - SRPGカーソルがマウス移動に追跡します。
 - マウスホイールによる未行動アクター選択

  ■ 更新履歴       ╒══════════════════════════╛
 v1.1 2023.8.17            おひさまクラフトによる改変
 v1.0 2020.11.09           プラグイン完成

 ■ プラグインダウンロード ╒══════════════════════════╛
 v1.0 https://www.dropbox.com/s/4uep2mwnwnxwd2c/SRPG_Mouse_Operation.js?dl=0
 v1.1 https://github.com/Ohisama-Craft

 ■ スクリーンショット ╒══════════════════════════╛
 Coming Soon
  
 ■ デモ ╒══════════════════════════╛
 https://ohisamacraft.nyanta.jp/index.html

 ■ 使い方       ╒══════════════════════════╛
 1. 本プラグインを以下の順番で配置してください:
 SRPG_core.js
 SRPG_UX_Cursor.js
 SRPG_AOE.js
 SRPG_ShowPath.js
 <<<<<  本プラグイン [SRPG_Mouse_Operation.js]

 2. プラグインパラメータを設定してください。
      ~ [任意] SRPG戦闘外で境界スクロールを有効化するためのスイッチIDを設定
      ~ [任意] ドラッグスクロールを有効化するためのスイッチIDを設定
      ~ カーソル移動のディレイを設定（作者は0を推奨）

 3. SRPG戦闘外で境界スクロールを有効化する場合、2で設定したスイッチIDをイベント等によりオンにしてください。
    境界スクロールはSRPGでは自動的に有効になります。

 ■ 依存関係     ╒══════════════════════════╛
 SRPG_core.js
 SRPG_UX_Cursor.js
 SRPG_ShowPath.js
 SRPG_AOE.js

 ■ 互換性    ╒══════════════════════════╛
 ほとんどのプラグインと互換性があります。
 本プラグインはEST_STRATEGY_MOUSE_CAM.jsとは互換性がありませんが、これは本プラグインがそのフォークバージョンであるためです。
 そのためほとんどのコードが含まれています。両方導入してしまうと、上書きしたメソッドに不都合が生じます。

 ■ パラメータ       ╒══════════════════════════╛
  >> 境界スクロールスイッチ
      ~ SRPG戦闘外で境界スクロールを有効化するためのスイッチです。SRPG戦闘でのみ有効化したい場合、0にしてください。
  >> 境界距離1
      ~ カメラスクロールがゆっくりになる前の距離。
  >> スクロール速度1
      ~ マウスが境界距離1にある場合のスクロール速度。
  >> 2フェイズ速度
      ~ True -> 境界に近づくにつれて速度が可変 
        False -> 速度不変
  >> 境界距離2
      ~ カメラスクロールが速くなる前の距離。境界距離1よりも小さな値にする必要があります。
  >> スクロール速度2
      ~ マウスが境界距離2にある場合のスクロール速度。
  >> ドラッグスクロールスイッチ
      ~ 中クリックによるマップのドラッグ操作を有効化するためのスイッチ。無効にする場合は0に設定してください。
  >> ドラッグスクロール速度
      ~ ドラッグスクロールの速度。高いほど速いです。2～4を推奨します。
  >> カーソル追跡スイッチ
    ~ マウス移動へのカーソル追跡を有効化するためのスイッチ。常に有効化する場合、0に設定してください。
  >> カーソル追跡ディレイ
    ~ マウス移動へのカーソル追跡のディレイ。
 
 ■ Extra Credit ╒══════════════════════════╛
 Estriole for EST_STRATEGY_MOUSE_CAM.js plugin code
 (with permission to be used as part of SRPG Project)
*/

var EST = EST || {};
EST.SRPGMouseOperation = EST.SRPGMouseOperation || {};
EST.SRPGMouseOperation.pluginName="SRPG_MouseOperation_MZ";

const coreParameters = PluginManager.parameters('SRPG_core_MZ');
var _srpgUseArrowButtons = coreParameters['srpgUseArrowButtons'] || 'true';

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
// Update setHiddenPointer for some battlePhase & subBattlePhase
//=============================================================================
// setHiddenPointer in the beginning of actor turn
$.srpgStartActorTurn = Game_System.prototype.srpgStartActorTurn;
Game_System.prototype.srpgStartActorTurn = function() {
    $.srpgStartActorTurn.call(this);
    Graphics.setHiddenPointer(true);
};

// setHiddenPointer after selecting any command
// I don't know how to prevent Graphics.setHiddenPointer(false); 
// in $.TouchInput_onMouseMove to be executed until the cursor really arrived to target
$.startActorTargetting = Scene_Map.prototype.startActorTargetting;
Scene_Map.prototype.startActorTargetting = function() {
    $.startActorTargetting.call(this);
    Graphics.setHiddenPointer(true);
};

// setHiddenPointer after any action
// I don't know how to prevent Graphics.setHiddenPointer(false); 
// in $.TouchInput_onMouseMove to be executed until the cursor really arrived to target
$.srpgAfterAction = Scene_Map.prototype.srpgAfterAction;
Scene_Map.prototype.srpgAfterAction = function() {
    $.srpgAfterAction.call(this);
    if ($gameSystem.isBattlePhase() === 'actor_phase') {
        Graphics.setHiddenPointer(true);
    }
};

/* It seems this block of code can be used for Graphics.setHiddenPointer(true); in some subBattlePhase
$.srpgControlPhase = Scene_Map.prototype.srpgControlPhase;
Scene_Map.prototype.srpgControlPhase = function() {
    $.srpgControlPhase.call(this);
    // additional function here    
};
*/

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
// MouseInput
//=============================================================================
$.TouchInput_onMouseMove = TouchInput._onMouseMove;
TouchInput._onMouseMove = function(event) {
  $.TouchInput_onMouseMove.call(this,event);
  if ($gameSystem && $gameSystem.isSRPGMode()) {
    // プレイヤーの移動中は、以下の処理はスキップする
    if ($gameSystem.srpgWaitMoving() ||
        $gameTemp.isAutoMoveDestinationValid() ||
        $gamePlayer.isJumping()) {
        return;
    } 
  }
  this._mouseX = Graphics.pageToCanvasX(event.pageX);
  this._mouseY = Graphics.pageToCanvasY(event.pageY);
  Graphics.setHiddenPointer(false);
};

// Note for Mr Takumi Ariake
// I created the initial function for $.TouchInput_onLeftButtonDown, where a left mouse click will make the mouse pointer to reappear.
// But I haven't found a way to make the mouse pointer reappear right above the event where the current cursor(player) position is
//  and directly select that event to enter the next subbattlephase.
// This is the function used by SRPG Studio software.

/* The function
$.TouchInput_onLeftButtonDown = TouchInput._onLeftButtonDown;
TouchInput._onLeftButtonDown = function(event) {
    $.TouchInput_onLeftButtonDown.call(this, event);
    if ($gameSystem.isSRPGMode()) {
        Graphics.setHiddenPointer(false);
    }
};
*/

//=============================================================================
// TouchInput
//=============================================================================
$.TouchInput_onTouchStart = TouchInput._onTouchStart;
TouchInput._onTouchStart = function(event) {
    $.TouchInput_onTouchStart.call(this, event);
    Graphics.setHiddenPointer(true);
};

TouchInput.atLeftBorder = function(){
  if(this._mouseX < $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atRightBorder = function(){
  if(this._mouseX > Graphics.width - $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atTopBorder = function(){
  if(this._mouseY < $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atBottomBorder = function(){
  if(this._mouseY > Graphics.height - $.Parameters.borderDistance1) return true;
  return false;
};

TouchInput.atDeepLeftBorder = function(){
  if(this._mouseX < $.Parameters.borderDistance2) return true;
  return false;
};

TouchInput.atDeepRightBorder = function(){
  if(this._mouseX > Graphics.width - $.Parameters.borderDistance2) return true;
  return false;
};

TouchInput.atDeepTopBorder = function(){
  if(this._mouseY < $.Parameters.borderDistance2) return true;
  return false;
};

TouchInput.atDeepBottomBorder = function(){
  if(this._mouseY > Graphics.height - $.Parameters.borderDistance2) return true;
  return false;
};

//modified by OhisamaCraft
TouchInput.inButtonArea = function(){
  if (!ConfigManager.touchUI) return false;
  if ($gameSystem && $gameSystem.isSRPGMode()) {
    const offsetX = (Graphics.width - Graphics.boxWidth) / 2;
    const offsetY = (Graphics.height - Graphics.boxHeight) / 2;
    const width = Sprite_Button.prototype.blockWidth.call(this) * 2;
    const height = Sprite_Button.prototype.blockHeight.call(this);
    const menuX = offsetX + Graphics.boxWidth - width - 4;
    const menuY = offsetY + 2;
    const menuLeft = menuX;
    const menuRight = menuX + width;
    const menuUpper = menuY;
    const menuLower = menuY + height;
    if (_srpgUseArrowButtons !== "true") {
      return ((this._mouseX > menuLeft && this._mouseX < menuRight) &&
              (this._mouseY > menuUpper && this._mouseY < menuLower));
    } else {
      const pageX = offsetX + 4;
      const pageY = offsetY + 2;
      const pageLeft = pageX;
      const pageRight = pageX + width + 4;
      const pageUpper = pageY;
      const pageLower = pageY + height;
      return (((this._mouseX > menuLeft && this._mouseX < menuRight) &&
               (this._mouseY > menuUpper && this._mouseY < menuLower)) ||
              ((this._mouseX > pageLeft && this._mouseX < pageRight) &&
               (this._mouseY > pageUpper && this._mouseY < pageLower)));
    }
  }
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
    if ($gameSystem.isSRPGMode() && $gameSystem.isPlayerFollowMouse() &&
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
    // modified by OhisamaCraft
    if(!this._flagSRPGNormalPhaseCenterOnce && !$gameSystem.isPlayerFollowMouse()) {
      Graphics.setHiddenPointer(true);
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
    $gameSystem.getNextRActor();
  }; 
  if(this._newState.wheelY < 0) {
    $gameSystem.getNextLActor();
  };
};

$.Game_System_getNextRActor = Game_System.prototype.getNextRActor;
Game_System.prototype.getNextRActor = function() {
  $.Game_System_getNextRActor.call(this);
  Graphics.setHiddenPointer(true);
  if(!$.Parameters.isWheelCenter) return;
  $gameMap._flagSRPGNormalPhaseCenterOnce = false;  
  $gameMap._oldSRPGScreenCheckX = false;
  $gameMap._oldSRPGScreenCheckY = false;
};

$.Game_System_getNextLActor = Game_System.prototype.getNextLActor;
Game_System.prototype.getNextLActor = function() {
  $.Game_System_getNextLActor.call(this);
  Graphics.setHiddenPointer(true);
  if(!$.Parameters.isWheelCenter) return;
  $gameMap._flagSRPGNormalPhaseCenterOnce = false;
  $gameMap._oldSRPGScreenCheckX = false;
  $gameMap._oldSRPGScreenCheckY = false;
};

// overwrite Return Cursor when Deselecting (in SRPG_UX_Cursor)
Scene_Map.prototype.isReturnCursorDeselecting = function() {
  return ((($gameSystem.isSubBattlePhase() === 'actor_move' &&
      !($gameSystem.isPlayerFollowMouse() && !Graphics._hiddenPointer))) ||
      $gameSystem.isSubBattlePhase() === 'actor_target' ||
      $gameSystem.isSubBattlePhase() === 'actor_targetArea') &&
      this.isMenuCalled();
};

})(EST.SRPGMouseOperation);
