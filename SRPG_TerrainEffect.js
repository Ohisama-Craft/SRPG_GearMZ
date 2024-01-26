//=============================================================================
//Boomy_TerrainEffect.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Modifies a unit's stats when standing on particular terrain
 * @author Boomy 
 *
* @param Terrain Tag 0 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 0 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 0 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 1 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 1 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 1 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @param Terrain Tag 2 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 2 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 2 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @param Terrain Tag 3 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 3 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 3 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @param Terrain Tag 4 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 4 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 4 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @param Terrain Tag 5 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 5 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 5 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @param Terrain Tag 6 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 6 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 6 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @param Terrain Tag 7 Param Modifier
* @type number[]
* @desc Modifiers to param values. 1 = maxHp 2 = maxMp 3 = atk... Values over 8 are ignored
* @default ["0","0","0","0","0","0","0","0"]
 *  
 * @param Terrain Tag 7 sParam Multiplier
* @type number[]
* @desc 1:TargetRate 2:Guard 3:Recovery 4:Pharmacology 5:MP Cost 6:TP Charge 7:PDR 8:MDR 9:Floor Damage 10:Exp
* @default ["1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ,"1" ]
 *  
 * @param Terrain Tag 7 xParam Modifier
* @type number[]
* @desc 1:Hit 2:Eva 3:Crit 4:Crit Avoid 5:Mag Eva 6:Mag Reflect 7:Counter 8:HP Regen 9:MP Regen 10:TP Regen
* @default ["0","0","0","0","0","0","0","0","0","0"]
 * 
 * @help
* Change a unit's parameter's based on the terrainId of the tile they are standing on
*
 */
(function () {

 var substrBegin = document.currentScript.src.lastIndexOf('/');
    var substrEnd = document.currentScript.src.indexOf('.js');
    var scriptName = document.currentScript.src.substring(substrBegin + 1, substrEnd);
    var parameters = PluginManager.parameters(scriptName);

  Game_BattlerBase.prototype.getTagId = function() {
        var eventId = 0;
        for (var i = 0; i < $gameSystem._EventToUnit.length; i++) {
            if ($gameSystem.EventToUnit(i)) {
                if ($gameSystem.EventToUnit(i)[1] === this) {
                    eventId = i;
                    break;
                }
            }
        }
        if ($gameMap.event(eventId)) {
            var event = $gameMap.event(eventId);
            return $gameMap.terrainTag(event.posX(), event.posY());
        } else {
            return 0;
        }
    };
    var _Game_BattlerBase_xparam = Game_BattlerBase.prototype.xparam;
    Game_BattlerBase.prototype.xparam = function(xparamId) {
        if ($gameSystem.isSRPGMode() == true) {
            var tagId = this.getTagId();
            var modifierName = "Terrain Tag " + tagId + " xParam Modifier";
            var value = _Game_BattlerBase_xparam.call(this, xparamId);
            var terrainMod = Number(eval(parameters[modifierName])[xparamId]);
            value += terrainMod;
            return value;
        } else {
            return _Game_BattlerBase_xparam.call(this, xparamId);
        }
    };
    var _Game_BattlerBase_sparam = Game_BattlerBase.prototype.sparam;
    Game_BattlerBase.prototype.sparam = function(sparamId) {
        if ($gameSystem.isSRPGMode() == true) {
            var tagId = this.getTagId();
            var modifierName = "Terrain Tag " + tagId + " sParam Multiplier";
            var value = _Game_BattlerBase_sparam.call(this, sparamId);
            var terrainMod = Number(eval(parameters[modifierName])[sparamId]);
            value *= terrainMod;
            return value;
        } else {
            return _Game_BattlerBase_sparam.call(this, sparamId);
        }
    };
    var _Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        if ($gameSystem.isSRPGMode() == true) {
            var tagId = this.getTagId();
            var modifierName = "Terrain Tag " + tagId + " Param Modifier";
            var value = _Game_Actor_paramPlus.call(this, paramId);
            var terrainMod = Number(eval(parameters[modifierName])[paramId]);
            value += terrainMod;
            return Math.floor(value);
        } else {
            return _Game_Actor_paramPlus.call(this, paramId);
        }
    };
    var _Game_Enemy_paramPlus = Game_Enemy.prototype.paramPlus;
    Game_Enemy.prototype.paramPlus = function(paramId) {
        if ($gameSystem.isSRPGMode() == true) {
            var tagId = this.getTagId();
            var modifierName = "Terrain Tag " + tagId + " Param Modifier";
            var value = _Game_Enemy_paramPlus.call(this, paramId);
            var terrainMod = Number(eval(parameters[modifierName])[paramId]);
            value += terrainMod;
            return Math.floor(value);
        } else {
            return _Game_Enemy_paramPlus.call(this, paramId);
        }
    };

})();
