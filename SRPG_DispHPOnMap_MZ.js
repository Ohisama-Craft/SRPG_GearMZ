// =============================================================================
// SRPG_DispHPOnMap_MZ.js
// Version: 1.01
// -----------------------------------------------------------------------------
// Copyright (c) 2018 ヱビ
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
// -----------------------------------------------------------------------------
// [Homepage]: ヱビのノート
//             http://www.zf.em-net.ne.jp/~ebi-games/
// =============================================================================


/*:
 * @target MZ
 * @plugindesc v1.01 It enables to display HP on the map during SRPG combat (edited by Ohisama-Craft).
 * @author ヱビ
 * @base SRPG_core_MZ
 * @orderAfter SRPG_core_MZ
 * 
 * @param actorHPColor1
 * @type number
 * @min 0
 * @desc The color1 (color No. of img/system/Window.png) of HP gauges of actors.
 * @default 20
 * 
 * @param actorHPColor2
 * @type number
 * @min 0
 * @desc The color2 (color No. of img/system/Window.png) of HP gauges of actors.
 * @default 21
 * 
 * @param enemyHPColor1
 * @type number
 * @min 0
 * @desc The color1 (color No. of img/system/Window.png) of HP gauges of enemies.
 * @default 22
 * 
 * @param enemyHPColor2
 * @type number
 * @min 0
 * @desc The color2 (color No. of img/system/Window.png) of HP gauges of enemies.
 * @default 23
 * 
 * @help
 * copyright 2018 エビ. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * Overview
 * ============================================================================
 * 
 * A plugin to display HP on a map during SRPG combat.
 * 
 * 
 * ============================================================================
 * Version History
 * ============================================================================
 * 
 * Version 1.01
 *   Users can now change the colors of HP gauges of actors and enemies.
 * 
 * Version 1.00
 *   Released
 * 
 * ============================================================================
 * EULA
 * ============================================================================
 * 
 * ・It is released under MIT Lincense. That is;
 * ・No credits required.
 * ・Can be used commercially.
 * ・Can be modified. (However, do not delete the license texts from the source code.)
 * ・Can be reposted.
 * ・Can be used for NSFW games.
 * 
 */

/*:ja
 * @target MZ
 * @plugindesc v1.01 SRPG戦闘中、マップでもHPが確認できるようになるプラグイン(おひさまクラフトによる改変あり)。
 * @author ヱビ
 * @base SRPG_core_MZ
 * @orderAfter SRPG_core_MZ
 * 
 * @param actorHPColor1
 * @type number
 * @min 0
 * @desc アクターのHPゲージの色１（img/system/Window.pngの色の番号）です。
 * @default 20
 * 
 * @param actorHPColor2
 * @type number
 * @min 0
 * @desc アクターのHPゲージの色２（img/system/Window.pngの色の番号）です。
 * @default 21
 * 
 * @param enemyHPColor1
 * @type number
 * @min 0
 * @desc 敵キャラのHPゲージの色１（img/system/Window.pngの色の番号）です。
 * @default 22
 * 
 * @param enemyHPColor2
 * @type number
 * @min 0
 * @desc 敵キャラのHPゲージの色２（img/system/Window.pngの色の番号）です。
 * @default 23
 * 
 * @help
 * copyright 2018 エビ. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 概要
 * ============================================================================
 * 
 * SRPG戦闘中、マップでもHPが確認できるようになるプラグイン。
 * 
 * 
 * ============================================================================
 * 更新履歴
 * ============================================================================
 * 
 * Version 1.01
 *   アクターのHPゲージ、敵キャラのHPゲージの色を変えられるようにしました。
 * 
 * Version 1.00
 *   公開
 * 
 * ============================================================================
 * 利用規約
 * ============================================================================
 * 
 * ・MITライセンスです。つまり↓↓
 * ・クレジット表記は不要
 * ・営利目的で使用可
 * ・改変可
 *     ただし、ソースコードのヘッダのライセンス表示は削除しないでください。
 * ・素材だけの再配布も可
 * ・アダルトゲーム、残酷なゲームでの使用も可
 * 
 */

//====================================================================
// ●Function Declaration
//====================================================================
function Window_DispHPGauge() {
    this.initialize(...arguments);
}

Window_DispHPGauge.prototype = Object.create(Window_StatusBase.prototype);
Window_DispHPGauge.prototype.constructor = Window_DispHPGauge;

function Sprite_UnitGauge() {
    this.initialize(...arguments);
}

Sprite_UnitGauge.prototype = Object.create(Sprite.prototype);
Sprite_UnitGauge.prototype.constructor = Sprite_Gauge;

//====================================================================
// ●Plugin
//====================================================================
(function() {

    var parameters = PluginManager.parameters('SRPG_DispHPOnMap_MZ');
	var actorHPColor1 = Number(parameters['actorHPColor1']);
	var actorHPColor2 = Number(parameters['actorHPColor2']);
	var enemyHPColor1 = Number(parameters['enemyHPColor1']);
	var enemyHPColor2 = Number(parameters['enemyHPColor2']);

//=============================================================================
// Game_BattlerBase
//=============================================================================
    // UX_Windowsで再定義する
    Game_BattlerBase.prototype.srpgHideHpMp = function() {
		return false;
	};

//=============================================================================
// Sprite_Character
//=============================================================================

	var _SRPG_Sprite_Character_updateCharacterFrame = Sprite_Character.prototype.updateCharacterFrame;
	Sprite_Character.prototype.updateCharacterFrame = function() {
		_SRPG_Sprite_Character_updateCharacterFrame.call(this);
		if ($gameSystem.isSRPGMode() == true && this._character.isEvent() == true) {
			var battlerArray = $gameSystem.EventToUnit(this._character.eventId());
			if (battlerArray) {
				this.createHpGauge();
			}
		}
	};

	Sprite_Character.prototype.createHpGauge = function() {
		if (!this._HpGauge) {
            const rect = this.srpgDispHPGaugeRect();
			this._HpGauge = new Window_DispHPGauge(rect);
			var battler = $gameSystem.EventToUnit(this._character.eventId())[1];
			this._HpGauge.setBattler(battler);
			this.addChild(this._HpGauge);
		}
	};

    // ステータスウィンドウ ターゲットウィンドウのrectを設定する
    Sprite_Character.prototype.srpgDispHPGaugeRect = function() {
        const ww = 100;
        const wh = 100;
        const wx = -36;
        const wy = -32;
        return new Rectangle(wx, wy, ww, wh);
    };

//====================================================================
// ●Sprite_UnitGauge
//====================================================================
Sprite_UnitGauge.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
    this.initMembers();
    this.createBitmap();
};

Sprite_UnitGauge.prototype.initMembers = function() {
    this._battler = null;
    this._statusType = "";
    this._value = NaN;
    this._maxValue = NaN;
    this._targetValue = NaN;
    this._targetMaxValue = NaN;
    this._duration = 0;
    this._flashingCount = 0;
};

Sprite_UnitGauge.prototype.destroy = function(options) {
    this.bitmap.destroy();
    Sprite.prototype.destroy.call(this, options);
};

Sprite_UnitGauge.prototype.createBitmap = function() {
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.bitmap = new Bitmap(width, height);
};

Sprite_UnitGauge.prototype.bitmapWidth = function() {
    return 48;
};

Sprite_UnitGauge.prototype.bitmapHeight = function() {
    return 24;
};

Sprite_UnitGauge.prototype.gaugeHeight = function() {
    return 6;
};

Sprite_UnitGauge.prototype.gaugeX = function() {
    return 0;
};

Sprite_UnitGauge.prototype.setup = function(battler, statusType, unitType) {
    this._battler = battler;
    this._statusType = statusType;
    this._unitType = unitType;
    this._value = this.currentValue();
    this._maxValue = this.currentMaxValue();
    this.updateBitmap();
};

Sprite_UnitGauge.prototype.update = function() {
    Sprite.prototype.update.call(this);
    this.updateBitmap();
};

Sprite_UnitGauge.prototype.updateBitmap = function() {
    const value = this.currentValue();
    const maxValue = this.currentMaxValue();
    if (value !== this._targetValue || maxValue !== this._targetMaxValue) {
        this.updateTargetValue(value, maxValue);
    }
    this.updateGaugeAnimation();
};

Sprite_UnitGauge.prototype.updateTargetValue = function(value, maxValue) {
    this._targetValue = value;
    this._targetMaxValue = maxValue;
    if (isNaN(this._value)) {
        this._value = value;
        this._maxValue = maxValue;
        this.redraw();
    } else {
        this._duration = this.smoothness();
    }
};

Sprite_UnitGauge.prototype.smoothness = function() {
    return this._statusType === "time" ? 5 : 20;
};

Sprite_UnitGauge.prototype.updateGaugeAnimation = function() {
    if (this._duration > 0) {
        const d = this._duration;
        this._value = (this._value * (d - 1) + this._targetValue) / d;
        this._maxValue = (this._maxValue * (d - 1) + this._targetMaxValue) / d;
        this._duration--;
        this.redraw();
    }
};

Sprite_UnitGauge.prototype.isValid = function() {
    if (this._battler && this._battler.isAlive()) {
        return true;
    }
    return false;
};

Sprite_UnitGauge.prototype.currentValue = function() {
    if (this._battler) {
        if ($gameSystem.isSRPGMode() && this._battler.srpgHideHpMp()) {
            return 100;
        } else {
            switch (this._statusType) {
                case "hp":
                    return this._battler.hp;
                case "mp":
                    return this._battler.mp;
                case "tp":
                    return this._battler.tp;
                case "time":
                    return this._battler.tpbChargeTime();
            }
        }
    }
    return NaN;
};

Sprite_UnitGauge.prototype.currentMaxValue = function() {
    if (this._battler) {
        if ($gameSystem.isSRPGMode() && this._battler.srpgHideHpMp()) {
            return 100;
        } else {
            switch (this._statusType) {
                case "hp":
                    return this._battler.mhp;
                case "mp":
                    return this._battler.mmp;
                case "tp":
                    return this._battler.maxTp();
                case "time":
                    return 1;
            }
        }
    }
    return NaN;
};

Sprite_UnitGauge.prototype.gaugeBackColor = function() {
    return ColorManager.gaugeBackColor();
};

Sprite_UnitGauge.prototype.gaugeColor1 = function() {
    switch (this._unitType) {
        case "actor":
            return ColorManager.textColor(actorHPColor1);
        case "enemy":
            return ColorManager.textColor(enemyHPColor1);
        default:
            return ColorManager.normalColor();
    }
};

Sprite_UnitGauge.prototype.gaugeColor2 = function() {
    switch (this._unitType) {
        case "actor":
            return ColorManager.textColor(actorHPColor2);
        case "enemy":
            return ColorManager.textColor(enemyHPColor2);
        default:
            return ColorManager.normalColor();
    }
};

Sprite_UnitGauge.prototype.redraw = function() {
    this.bitmap.clear();
    const currentValue = this.currentValue();
    if (!isNaN(currentValue)) {
        this.drawGauge();
    }
};

Sprite_UnitGauge.prototype.drawGauge = function() {
    const gaugeX = this.gaugeX();
    const gaugeY = this.bitmapHeight() - this.gaugeHeight();
    const gaugewidth = this.bitmapWidth() - gaugeX;
    const gaugeHeight = this.gaugeHeight();
    this.drawGaugeRect(gaugeX, gaugeY, gaugewidth, gaugeHeight);
};

Sprite_UnitGauge.prototype.drawGaugeRect = function(x, y, width, height) {
    const rate = this.gaugeRate();
    const fillW = Math.floor((width - 2) * rate);
    const fillH = height - 2;
    const color0 = this.gaugeBackColor();
    const color1 = this.gaugeColor1();
    const color2 = this.gaugeColor2();
    this.bitmap.fillRect(x, y, width, height, color0);
    this.bitmap.gradientFillRect(x + 1, y + 1, fillW, fillH, color1, color2);
};

Sprite_UnitGauge.prototype.gaugeRate = function() {
    if (this.isValid()) {
        const value = this._value;
        const maxValue = this._maxValue;
        return maxValue > 0 ? value / maxValue : 0;
    } else {
        return 0;
    }
};

Sprite_UnitGauge.prototype.drawValue = function() {
    const currentValue = this.currentValue();
    const width = this.bitmapWidth();
    const height = this.bitmapHeight();
    this.setupValueFont();
    this.bitmap.drawText(currentValue, 0, 0, width, height, "right");
};

//=============================================================================
// Window_DispHPGauge
//=============================================================================
// 参考：YEP_X_VisualHpGauge.js

Window_DispHPGauge.prototype.initialize = function(rect) {
    this._dropSpeed = 0;
    this._visibleCounter = 0;
    Window_StatusBase.prototype.initialize.call(this, rect);
    this._battler = null;
    this._requestRefresh = false;
    this._currentHpValue = 0;
    this._displayedValue = 0;
    this.opacity = 0;
};

Window_DispHPGauge.prototype.setBattler = function(battler) {
    if (this._battler === battler) return;
    this._battler = battler;
    this._currentHpValue = this._battler ? this._battler.hp : 0;
    this._displayedValue = this._battler ? this._battler.hp : 0;
};

Window_DispHPGauge.prototype.update = function() {
    Window_StatusBase.prototype.update.call(this);
    if (!this._battler) return;
    this.updateWindowAspects();
};

Window_DispHPGauge.prototype.updateWindowAspects = function() {
    this.updateWindowSize();
    this.updateOpacity();
    this.updateRefresh();
};

Window_DispHPGauge.prototype.updateWindowSize = function() {
	var width = 48 + this.padding * 2;
	var height = this.lineHeight() * 1.5 + this.padding * 2;
	if (width === this. width && height === this.height) return;
	this.width = width;
	this.height = height;
    this.createContents();
    this._requestRefresh = true;
};

Window_DispHPGauge.prototype.updateOpacity = function() {
    if (this.isShowWindow()) {
      this.contentsOpacity += 32;
    } else {
      this.contentsOpacity -= 32;
    }
};

Window_DispHPGauge.prototype.isShowWindow = function() {
	if (!this._battler) return false;
	if (this._battler.isDead()) return false;
	return true;
};

Window_DispHPGauge.prototype.updateHpPosition = function() {
    if (!this._battler) return;
    if (this._currentHpValue !== this._battler.hp) {
      this._visibleCounter = 10;
      this._currentHpValue = this._battler.hp;
      var difference = Math.abs(this._displayedValue - this._battler.hp);
      this._dropSpeed = Math.ceil(difference / 10);
    }
    this.updateDisplayCounter();
};

Window_DispHPGauge.prototype.updateDisplayCounter = function() {
    if (this._battler._barrierAltered) {
      this._battler._barrierAltered = false;
    } else if (this._currentHpValue === this._displayedValue) {
      return;
    }
    var d = this._dropSpeed;
    var c = this._currentHpValue;
    if (this._displayedValue > this._currentHpValue) {
      this._displayedValue = Math.max(this._displayedValue - d, c);
    } else if (this._displayedValue < this._currentHpValue) {
      this._displayedValue = Math.min(this._displayedValue + d, c);
    }
    this._requestRefresh = true;
};

Window_DispHPGauge.prototype.updateRefresh = function() {
    if (this._requestRefresh) this.refresh();
};

Window_DispHPGauge.prototype.refresh = function() {
    this.contents.clear();
    if (!this._battler) return;
    if (this._battler.isDead()) return;
    this._requestRefresh = false;
    this.placeUnitGaugeSrpg(this._battler, "hp", 0, 0);
};

// ゲージの描画(sprite)
Window_StatusBase.prototype.placeUnitGaugeSrpg = function(battler, type, x, y) {
    const key = "event%1-unitGauge-%2".format(battler.srpgEventId(), type);
    const sprite = this.createInnerSprite(key, Sprite_UnitGauge);
    const unitType = battler.isActor() ? "actor" : "enemy";
    sprite.setup(battler, type, unitType);
    sprite.move(x, y);
    sprite.show();
};

})();
