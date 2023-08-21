//=============================================================================
// SRPG_core_MZ.js -SRPGギアMZ-
// バージョン      : 1.06 + Q
// 最終更新日      : 2023/8/21
// 製作            : Tkool SRPG team（有明タクミ、RyanBram、Dr.Q、Shoukang、Boomy）
// 協力            : アンチョビさん、エビさん、Tsumioさん
// ベースプラグイン : SRPGコンバータMV（神鏡学斗(Lemon slice), Dr. Q, アンチョビ, エビ, Tsumio）
// 配布元          : https://ohisamacraft.nyanta.jp/index.html
//-----------------------------------------------------------------------------
// copyright 2017 - 2021 Lemon slice all rights reserved.
// copyright 2022 Takumi Ariake (Tkool SRPG team) all rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPG battle system (tactical battle system) for RPG maker(tkool) MV based on SRPG converter MV.
 * @author Tkool SRPG team(Takumi Ariake, RyanBram, Dr.Q, Shoukang, Boomy)
 *
 * @param BasicParam
 * @desc Set basic parameters such as specifying the switch / variable to be used and setting the plug-in to be used together.
 * @default Basic functions related to the entire game
 * 
 * @param WithYEP_BattleEngineCore
 * @parent BasicParam
 * @desc Set true when using with YEP_BattleEngineCore.
 * @type boolean
 * @default false
 * 
 * @param srpgTroopID
 * @parent BasicParam
 * @desc SRPGconverter use this troop ID.
 * @type number
 * @min 1
 * @default 1
 *
 * @param srpgBattleSwitchID
 * @parent BasicParam
 * @desc switch ID of 'in tactical battle' or 'not'. If using tactical battle system, this swith turn on.
 * @type switch
 * @default 1
 *
 * @param existActorVarID
 * @parent BasicParam
 * @desc variable ID of 'exist actor'. Exist is not death state and hide.
 * @type variable
 * @default 1
 *
 * @param existEnemyVarID
 * @parent BasicParam
 * @desc variable ID of 'exist enemy'. Exist is not death state and hide.
 * @type variable
 * @default 2
 *
 * @param turnVarID
 * @parent BasicParam
 * @desc variable ID of 'srpg turn'. first turn is 'turn 1'.
 * @type variable
 * @default 3
 *
 * @param activeEventID
 * @parent BasicParam
 * @desc variable ID of 'acting event ID'.
 * @type variable
 * @default 4
 *
 * @param targetEventID
 * @parent BasicParam
 * @desc variable ID of 'target event ID'. not only attack but also heal or assist.
 * @type variable
 * @default 5
 * 
 * @param battleDistanceID
 * @parent BasicParam
 * @desc variable ID of 'distance between user and target'. not only attack but also heal or assist.
 * @type variable
 * @default 6
 *
 * @param MapBattle(skip battle scene)
 * @desc Parameters related to map battles.
 * @default Map battle settings
 *
 * @param Use Map Battle
 * @parent MapBattle
 * @desc Default Map Battle usage
 * @type select
 * @option Always
 * @value 3
 * @option When Config is On(default off)
 * @value 2
 * @option When Switch is On
 * @value 1
 * @option Never 
 * @value 0
 * @default 2
 *
 * @param Map Battle Switch
 * @parent Use Map Battle
 * @desc Switch that activates map battle(When Use Map Battle is 1)
 * @type switch
 * @default 0
 *
 * @param Animation Delay
 * @parent MapBattle
 * @desc Frames between animation start and skill effect(Map Battle)
 * Set to -1 to wait for all animations to finish
 * @type number
 * @min -1
 * @default -1
 *
 * @param BattleBasicParam
 * @desc Set basic numerical values such as move and acquisition rate of exp.
 * @default Basic numbers used in SRPG battle
 *
 * @param defaultMove
 * @parent BattleBasicParam
 * @desc Default value for unit movement ability.
 * @type number
 * @min 0
 * @default 4
 *
 * @param srpgBattleExpRate
 * @parent BattleBasicParam
 * @desc if player can't defeat enemy, player get exp in this rate. set 0 to 1.0.
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.4
 *
 * @param srpgBattleExpRateForActors
 * @parent BattleBasicParam
 * @desc if player act for friends, player get exp in this rate(to next level). set 0 to 1.0. 
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.1
 * 
 * @param srpgAutoBattleStateId
 * @parent BattleBasicParam
 * @desc The ID of the state given to the actor when "Auto Battle" is selected (disabled by 0).
 * "Release at the end of the turn", "Continued turns 1-1", "trait: Automatic action".
 * @type state
 * @default 14
 * 
 * @param maxActorVarID
 * @parent BattleBasicParam
 * @desc variable ID of the maximum number of actors participating in the battle (disabled by 0).
 * @type variable
 * @default 0
 *
 *
 * @param srpgBestSearchRouteSize
 * @parent BattleBasicParam
 * @desc When there are no targets that can be attacked, search for routes to enemies at long distances. That search distance (disabled by 0).
 * @type number
 * @min 0
 * @default 25
 *
 * @param BattleExtensionParam
 * @desc Set extended functions such as screen effects and changing actor commands.
 * @default Extended battle capabilities
 * 
 * @param srpgActorCommandList
 * @parent BattleExtensionParam
 * @desc make actor command list. 
 * usable:attack,skill,item,equip,wait(split ',')
 * @type string
 * @default attack,skill,item,equip,wait
 * 
 * @param srpgActorCommandOriginalId
 * @parent srpgActorCommandList
 * @desc actor command 'original' execute specified skill. The ID of that skill.
 * @type skill
 * @default 1
 *
 * @param srpgMenuCommandList
 * @parent BattleExtensionParam
 * @desc Available: turnEnd,autoBattle,winLose,item,skill,equip,
 * status,formation,options,save,gameEnd,original (separated by ,)
 * @type string
 * @default turnEnd,autoBattle,winLose,status,options,save,gameEnd
 *
 * @param srpgPredictionWindowMode
 * @parent BattleExtensionParam
 * @desc Change the display of the battle prediction window. (1: full / 2: only attack name / 3: not displayed)
 * @type select
 * @option Full
 * @value 1
 * @option Only attack name
 * @value 2
 * @option Not displayed
 * @value 3
 * @default 1
 *
 * @param useAgiAttackPlus
 * @parent BattleExtensionParam
 * @desc Use the system that the unit with higher agility attacks twice.
 * @type boolean
 * @default true
 *
 * @param srpgAgilityAffectsRatio
 * @parent useAgiAttackPlus
 * @desc This is the ratio at which the difference in agility affects the probability of attack twice.
 * @type number
 * @min 1
 * @default 2
 * 
 * @param srpgAgiAttackPlusPayCost
 * @parent useAgiAttackPlus
 * @desc Change whether to consume costs such as MP when attacking twice.
 * @type select
 * @option Neither skills nor items consume costs
 * @value 1
 * @option Only skills consume costs
 * @value 2
 * @option Only items consume cost
 * @value 3
 * @option Both skills and items consume costs
 * @value 4
 * @default 1
 *
 * @param srpgBattleOrder
 * @parent BattleExtensionParam
 * @desc Change the order of actions in the battle scene.
 * @type select
 * @option Attacker is first
 * @value 1
 * @option Highly agile unit is first
 * @value 2
 * @default 1
 * 
 * @param srpgBattleReaction
 * @parent BattleExtensionParam
 * @desc Change whether the attacked side reacts (Counter attack etc.) in battle.
 * @type select
 * @option react 100%
 * @value 1
 * @option according to trait "counterAttack rate"
 * @value 2
 * @option do not react
 * @value 3
 * @default 1
 * 
 * @param srpgDefaultReactionSkill
 * @parent srpgBattleReaction
 * @desc Sets the default skill ID used in reaction.
 * When set to ID 1 "Attack", the weapon's <srpgWeaponSkill: X> is also reflected.
 * @type skill
 * @default 1
 * 
 * @param srpgBattleQuickLaunch
 * @parent BattleExtensionParam
 * @desc true is quick the battle start effect.(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgNotShowUpDeadActor
 * @parent BattleExtensionParam
 * @desc Exclude dead actors when in turn letting party members join the SRPG battle using <id: 0>. (True / false)
 * @type boolean
 * @default false
 * 
 * @param srpgBattleEndAllHeal
 * @parent BattleExtensionParam
 * @desc At the end of the SRPG battle, all actors will be automatically recovered.
 * @type boolean
 * @default true
 *
 * @param srpgDamageDirectionChange
 * @parent BattleExtensionParam
 * @desc When attacked, correct the direction towards the attacker.(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgSkipTargetForSelf
 * @parent BattleExtensionParam
 * @desc For actions targeting oneself, skip the target selection process.(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgRangeTerrainTag7
 * @parent BattleExtensionParam
 * @desc Make the terrain tag 7 that does not pass the range.(true / false)
 * @type boolean
 * @default true
 *
 * @param SRPGTerm
 * @desc Set terms such as "standby" and "move".
 * @default Terms used in SRPG battle
 *
 * @param enemyDefaultClass
 * @parent SRPGTerm
 * @desc the default name for the enemy class (it doesn't really affect it).
 * @default Enemy
 *
 * @param textSrpgEquip
 * @parent SRPGTerm
 * @desc A term for equipment (weapon). It is displayed in the SRPG status window.
 * @default Equipment
 *
 * @param textSrpgNone
 * @parent SRPGTerm
 * @desc Term displayed when there is no equipment
 * @default None
 *
 * @param textSrpgMove
 * @parent SRPGTerm
 * @desc A term for mobility (move range). It is displayed in the SRPG status window.
 * @default Move
 *
 * @param textSrpgRange
 * @parent SRPGTerm
 * @desc A term for range of an attack. It is displayed in the SRPG status window.
 * @default Range
 *
 * @param textSrpgWait
 * @parent SRPGTerm
 * @desc A term for waiting. It is displayed in the actor command window.
 * @default Wait
 *
 * @param textSrpgWinLoseCondition
 * @parent SRPGTerm
 * @desc A term for winning / losing conditions. It is displayed in the menu command window.
 * @default Win / Loss
 *
 * @param textSrpgWinCondition
 * @parent SRPGTerm
 * @desc A term for winning conditions. It is displayed in the win / loss conditions window.
 * @default Win
 *
 * @param textSrpgLoseCondition
 * @parent SRPGTerm
 * @desc A term for losing conditions. It is displayed in the win / loss conditions window.
 * @default Loss
 *
 * @param textSrpgTurnEnd
 * @parent SRPGTerm
 * @desc A term for the end of a (actor) turn. It is displayed on the menu command window.
 * @default Turn End
 *
 * @param textSrpgAutoBattle
 * @parent SRPGTerm
 * @desc A term for auto battle. It is displayed on the menu command window.
 * @default Auto Battle
 *
 * @param textSrpgDamage
 * @parent SRPGTerm
 * @desc A term for damage. It is displayed in the prediction window.
 * @default Damage
 *
 * @param textSrpgHealing
 * @parent SRPGTerm
 * @desc A term for healing. It is displayed in the prediction window.
 * @default Healing
 * 
 * @param textSrpgOptMapBattle
 * @parent SRPGTerm
 * @desc A term for using map battle. It is displayed in the config window.
 * @default skip battle scene
 *
 * @param SRPGFiles
 * @desc Set the images and sound effects used in SRPG battles.
 * @default Image and SE settings used in SRPG battles
 *
 * @param srpgSet
 * @parent SRPGFiles
 * @desc Spriteset for cursor and SRPG system icons
 * @type file
 * @dir img/characters/
 * @default !srpg_set_type1
 *
 * @param Path Image
 * @parent SRPGFiles
 * @desc Image to build the path from (Used in SRPG showPath MZ.js)
 * @dir img/system/
 * @type file
 * @default srpgPath
 * 
 * @param rewardSound
 * @parent SRPGFiles
 * @desc Sound effect for the reward window
 * @type file
 * @dir audio/se/
 * @default Item3
 *
 * @param expSound
 * @parent SRPGFiles
 * @desc Sound effect for the exp guage increasing
 * @type file
 * @dir audio/se/
 * @default Up4
 * 
 * @noteParam characterName
 * @noteDir img/characters/
 * @noteType file
 * @noteData enemies
 * 
 * @noteParam faceName
 * @noteDir img/faces/
 * @noteType file
 * @noteData enemies
 *
 * ==== plugin command ==== 
 * 
 * @command StartEnd
 * @text Start/End SRPG battle
 * @desc Start or end SRPG battle.
 * @arg key
 * @type select
 * @text Start/End toggle
 * @desc SRPG battle start/end should be performed on the map for SRPG battle.
 * @option Start of SRPG battle
 * @value start
 * @option End of SRPG battle
 * @value end
 * @default start
 * 
 * @command winLoseCondition
 * @text Set win/loss condition statement
 * @desc Set the text to be displayed in the "Win/Loss Conditions" in menu.
 * @arg key
 * @type select
 * @text Description of process
 * @desc Select Clear contents/set victory condition statement/set defeat condition statement.
 * @option Clear win/loss conditions
 * @value clear
 * @option Setting Winning Conditions
 * @value win
 * @option Setting Defeat Conditions
 * @value lose
 * @default clear
 * @arg text
 * @type string
 * @text Text of win/loss conditions
 * @desc Set the win condition statement/defeat condition statement. To create multiple lines, execute multiple times.
 * 
 * @command eventEventDistance
 * @text Obtaining the distance between units
 * @desc Obtains the distance between units based on the event ID.
 * @arg variableId
 * @type variable
 * @text stored variable
 * @desc This variable stores the distance.
 * @arg eventId1
 * @type number
 * @text Event ID 1
 * @desc The event ID of the unit for which you want to obtain the distance.
 * @min 1
 * @arg eventId2
 * @type number
 * @text Event ID 2
 * @desc The event ID of the unit for which you want to obtain the distance.
 * @min 1
 *
 * @command fromActorMinimumDistance
 * @text Obtaining the distance between a unit and an actor
 * @desc Gets the distance between the specified event and the nearest actor.
 * @arg variableId
 * @type variable
 * @text stored variable
 * @desc This variable stores the distance.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc The event ID of the unit. Get the distance between this unit and the nearest actor.
 * @min 1
 * 
 * @command checkUserAndTarget
 * @text Determine if the event is in action/target
 * @desc Checks if the two event IDs specified match the IDs of the event being acted upon or targeted.
 *       It is intended for use in pre-action events and during battle scene events.
 * @arg switchId
 * @type switch
 * @text stored switch
 * @desc Returns ON (true) if the two event IDs match the IDs in action/target.
 * @arg eventId1
 * @type number
 * @text Event ID 1
 * @desc Specify the ID for which you want to determine whether it is in action or targeted.
 * @min 1
 * @arg eventId2
 * @type number
 * @text Event ID 2
 * @desc Specify the ID for which you want to determine whether it is in action or targeted.
 * @min 1
 * 
 * @command isEventIdActor
 * @text Obtains the actor's event ID
 * @desc Returns the event ID of the specified actor to the specified variable.
 * @arg variableId
 * @type variable
 * @text stored variable
 * @desc This variable stores the actor's event ID.
 * @arg actorId
 * @type actor
 * @text Actor ID
 * @desc Actor for which the event ID is to be obtained. Returns 0 if not in SRPG battle.
 * 
 * @command isUnitHpMpTp
 * @text Get HP/MP/TP of the unit
 * @desc Obtains the HP/MP/TP of the unit with the specified event ID.
 * @arg variableId
 * @type variable
 * @text stored variable
 * @desc Variables to store HP/MP/TP.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc The event ID of the unit for which you wish to obtain HP/MP/TP.
 * @min 1
 * @arg key
 * @type select
 * @text HP/MP/TP
 * @desc Select the value to be retrieved.
 * @option HP
 * @option MP
 * @option TP
 * @default HP
 * 
 * @command isUnitStateAffected
 * @text Get the unit's state
 * @desc Obtains the state of the unit with the specified event ID.
 * @arg switchId
 * @type switch
 * @text stored switch
 * @desc Returns ON (true) if the unit is in that state.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc Specify the ID of the event for which you wish to obtain state.
 * @min 1
 * @arg stateId
 * @type state
 * @text state
 * @desc Specify the state you want to determine.
 * 
 * @command isEventIdXy
 * @text Obtains the event ID of the specified coordinates
 * @desc Returns the event ID at the specified XY coordinates.
 * @arg variableId
 * @type variable
 * @text stored variable
 * @desc This variable stores the event ID.
 * @arg x
 * @type number
 * @text X-coordinate
 * @desc The X coordinate you want to reference. The upper left corner of the map is (0, 0).
 * @min 0
 * @arg y
 * @type number
 * @text Y-coordinate
 * @desc The Y coordinate you want to reference. The upper left corner of the map is (0, 0).
 * @min 0
 * 
 * @command checkRegionId
 * @text Determines if there is an actor in a given region
 * @desc Returns whether the actor is on the region for the given ID.
 * @arg switchId
 * @type switch
 * @text stored switch
 * @desc Returns ON (true) if the actor is above the specified region.
 * @arg regionId
 * @type number
 * @text Region ID
 * @desc The ID of the region where you want to determine if the actor is located.
 * @max 255
 * @min 0
 * 
 * @command unitGainHpMpTp
 * @text operation of unit HP/MP/TP
 * @desc operate the HP/MP/TP of the unit with the specified event ID.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc The event ID of the unit whose HP/MP/TP you wish to manipulate.
 * @min 1
 * @arg key
 * @type select
 * @text HP/MP/TP
 * @desc Select the type to be manipulated.
 * @option HP
 * @option MP
 * @option TP
 * @default HP
 * @arg symbol
 * @type boolean
 * @text Addition/Subtraction
 * @desc Sets whether the change value should be added (+) or subtracted (-).
 * @on plus(+)
 * @off minus(-)
 * @arg variableId
 * @type variable
 * @text Change value (variables)
 * @desc If set to 0, the following change values (specified directly) are applied.
 * @default 0
 * @arg value
 * @type number
 * @text Change value (direct specification)
 * @desc HP/MP/TP change value. Positive values can be set.
 * @arg allowDeath
 * @type boolean
 * @text death state Permission
 * @desc If the HP is reduced to 0 as a result of the operation, it sets whether the combat is disabled or not.
 * @default false
 * 
 * @command unitAddRemoveState
 * @text operation of unit states
 * @desc Add/Remove state for the unit with the specified event ID.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc Specify the ID of the event for which you want to Add/Remove state.
 * @min 1
 * @arg stateId
 * @type state
 * @text state
 * @desc Specify the state you want to Add/Remove.
 * @arg key
 * @type select
 * @text Add/Remove
 * @desc Set to add or remove.
 * @option add
 * @value add
 * @option remove
 * @value remove
 * @default add
 * 
 * @command unitRecoverAll
 * @text Full recovery of the unit
 * @desc Recovers all units with the specified event ID (valid only for surviving units).
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc Specify the ID of the event for which you want to recover all.
 * @min 1
 * 
 * @command setBattleMode
 * @text Battle Mode Settings
 * @desc Changes the battle mode of a unit. It is used during automatic actions.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc Specify the ID of the event for which you want to change the battle mode.
 * @min 1
 * @arg mode
 * @type select
 * @text battle mode
 * @desc Select the battle mode you wish to set (see Help for more information on battle modes).
 * @option normal
 * @option stand
 * @option regionUp
 * @option regionDown
 * @option absRegionUp
 * @option absRegionDown
 * @option aimingEvent
 * @option aimingActor
 * @default normal
 * @arg targetId
 * @type number
 * @text target ID
 * @desc ID of the target when the battle mode is 'aimingEvent' or 'aimingActor'.
 * @min 1
 * 
 * @command unitTurnEndReaction
 * @text Set unit action end/re-action
 * @desc Ends or removes the end of action for the specified unit.
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc Specify the ID of the event for which you want the action to end/be re-activated.
 * @min 1
 * @arg key
 * @type select
 * @text End of action/re-action
 * @desc Sets whether the action should be terminated or re-activated.
 * @option end of action
 * @value turnEnd
 * @option Reaction
 * @value reaction
 * @default turnEnd
 * 
 * @command addUnit
 * @text Additional units (reinforcements)
 * @desc Turns the event with the specified ID into an actor/enemy.
 * @arg key
 * @type select
 * @text Actor/Enemy
 * @desc Select Actor or Enemy.
 * @option Actor
 * @value actor
 * @option Enemy
 * @value enemy
 * @default actor
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc The events of this ID are transformed into units to be reinforcements.
 * @min 1
 * @arg actorId
 * @type actor
 * @text Actor ID
 * @desc The actor you want to add. Actors who have already participated in the battle cannot be added.
 * @arg enemyId
 * @type enemy
 * @text Enemy ID
 * @desc The Enemy you wish to add. Enemies can be added even if there are units with the same ID.
 * 
 * @command playerMoveTo
 * @text Moving the player (cursor)
 * @desc Moves the player (cursor) to the specified position.
 * @arg key
 * @type select
 * @text Designation method of destination
 * @desc Choose whether to specify XY coordinates or the location of the event.
 * @option XY coordinates 
 * @value XY
 * @option event
 * @value event
 * @default XY
 * @arg x
 * @type number
 * @text X coordinate
 * @desc The X coordinate you want to move to. The upper left corner of the map is (0, 0).
 * @min 0
 * @arg y
 * @type number
 * @text Y coordinate
 * @desc The Y coordinate you want to move to. The upper left corner of the map is (0, 0).
 * @min 0
 * @arg eventId
 * @type number
 * @text Event ID
 * @desc Go to the location of the event with this ID. 0 for "this event".
 * @min 0
 * 
 * @command turnEnd
 * @text End of actor turn
 * @desc Ends the player's turn. This is only valid when the menu is open.
 *       It is the same as "End of Turn" in the menu.
 * 
 * @command mapSelfSwitchesControl
 * @text Self-switch operation
 * @desc It collectively operates the self-switches for the events on that map.
 *       This is useful when the same map is used repeatedly.
 * @arg tag
 * @type select
 * @text Switch to operate
 * @desc Select self-switches A ~ D. All can be selected by 'all'.
 * @option A
 * @option B
 * @option C
 * @option D
 * @option all
 * @arg value
 * @type boolean
 * @text ON/OFF
 * @desc Select ON/OFF switch.
 * 
 * @help
 * copyright 2017 - 2021 Lemon slice all rights reserved.
 * copyright 2022 Takumi Ariake (Tkool SRPG team) all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * Overview
 * ============================================================================
 * This plug-in is a collection of materials that allows you to create 
 * SRPG battle system in RPG Maker MV. Based on "SRPG Converter MV" 
 * by Lemon slice, we have organized and added functions.
 * Sample game is available in non-encrypted form and can be used as 
 * a reference for your production.
 * 
 * ============================================================================
 * Introduction
 * ============================================================================
 * Please install this plug-in (SRPG_core_MZ.js) and also install the following
 *  "required" plug-ins for use with this plug-in.
 * Copy the required images to the specified folder.
 * 
 * If you install the SRPG Gear/SRPG Converter extension plugin, 
 * please put it below this plugin (SRPG_core_MZ.js).
 * 
 * - Required images
 * characters/!srpg_set_type1.png or !srpg_set_type2.png
 * system/srpgPath.png
 * faces/BigMonster.png (optional)
 * 
 * - "Required" plug-ins
 * This plugin shares some functions with SRPG_core_MZ
 * and must be installed for it to work.
 * 
 * SRPG_AoE_MZ
 * SRPG_RangeControl_MZ
 * 
 * - "Recommended" plug-ins
 * These are plug-ins that can work without being installed, 
 * but are general-purpose and easy to use for most people.
 * However, this does not negate or discourage these other SRPG plug-ins.
 * In addition, these plug-ins have been checked for compatibility 
 * and have been modified by Ohisama Craft as necessary.
 * 
 * SRPG_AIControl_MZ
 * SRPG_AuraSkill_MZ
 * SRPG_BattlePrepare_MZ
 * SRPG_BattleUI_MZ
 * SRPG_DispHPOnMap_MZ
 * SRPG_MoveMethod_MZ (requires SRPG_AIControl)
 * SRPG_PositionEffects_MZ
 * SRPG_ShowPath_MZ
 * SRPG_Summon_MZ
 * SRPG_UX_Cursor_MZ
 * SRPG_UX_Windows_MZ
 * 
 * ============================================================================
 * Terms in this plug-in
 * ============================================================================
 * SRPG battle: The entire battle after SRPGBattle Start is executed.
 * battle Scene: sideview battle in sceneBattle or map battle.
 * Counterattack: Actions to be performed by the defender during combat 
 * (skills to be used can be set individually).
 * Tags: Content described in the memo field and referenced by plug-ins.
 * 
 * ============================================================================
 * Plug-in commands
 * ============================================================================
 * In SRPG Gear MZ, some of the processes that can be executed by 
 * Event Command > Script can be more easily used by using plug-in commands.
 * 
 * Starting and ending a SRPG battle
 * Obtaining event IDs, distances, and unit parameters
 * Manipulating unit parameters
 * Adding units (reinforcements)　　　　　　　　　　　　　　etc.
 * 
 * It also includes commands that are important to the progress of the battle, 
 * such as 'Start/End SRPG battle'.
 * 
 * /!\ Caution /!\
 * You cannot move the map (event command "Move Location") during SRPG battle.
 * Please execute "SRPGBattle Start" after moving to the map for SRPG battle.
 * Also, please execute "SRPGBattle End" before moving to another map.
 *
 * ============================================================================
 * Configuration by tags (memo)
 * ============================================================================
 * In this collection of materials, 
 * much of the necessary processing is done using "memo".
 * Write the prescribed commands in the memo for each item to 
 * implement the functions required in SRPG battle.
 * Enclose tags with < >. 
 * If you want to include a numerical value or a string, follow it with : .
 * 
 * === tags on Events ===
 * - Creating an Actor and Enemy
 * 	<type:actor>
 * 		# The event becomes an actor (used in combination with <id:X>).
 * 	<type:enemy>
 * 		# the event becomes an enemy (used in combination with <id:X>).
 * 	<id:X>
 * 		# The event becomes an actor/enemy with the ID specified by X 
 * 		# (X is a numerical value).
 * 	<searchItem:true>
 * 		# If the event is an actor, 
 * 		# when the unit event is in the movement range.
 * 		# Priority will be given to move there (only once).
 *
 * - Set action pattern
 * 	<mode:normal>
 * 		# Set the unit's action pattern to "normal".
 * 		# Move toward the nearest opponent unit.
 * 		# If no action pattern is set, it is automatically set to "normal".
 * 	<mode:stand>
 * 		# It waits in place until an opponent unit approaches or 
 * 		# the unit itself takes damage.
 * 	<mode:regionUp>
 * 		# If the opponent unit is not in attack range, 
 * 		# it will go to a larger region ID.
 * 	<mode:regionDown>
 * 		# If the opponent unit is not in attack range, 
 * 		# it will go to a smaller region ID.
 * 	<mode:absRegionUp>
 * 		# always go to a larger region ID.
 * 	<mode:absRegionDown>
 * 		# always go to smaller region ID.
 * 	<mode:aimingEvent> 
 * 		# Aiming at the event of the specified ID
 * 		# (Use in combination with <targetId:X>).
 * 	<mode:aimingActor> 
 * 		# Aiming at the actor with the specified ID
 * 		# (Use in combination with <targetId:X>).
 * 	<targetId:X>
 * 		# Aim at the event/actor with the ID specified by X.
 *
 * - related to objects on the map or event execution
 * 	<type:unitEvent>   
 * 		# The event will be executed when an actor acts on it.
 * 	<type:playerEvent> 
 * 		# That event will be executed when the decision key is pressed 
 * 		# by the player (cursor).
 * 		# actor can pass through it, but cannot act on it.
 * 	<type:object>      
 * 		# The event becomes an obstacle that 
 * 		# neither the actor nor the Enemy can pass through.
 * 		# If there is no image, it is passable.
 * 	<type:battleStart>
 * 		# The event will be executed automatically once 
 * 		# at the start of the SRPG battle.
 * 	<type:actorTurn>
 * 		# The event is automatically executed 
 * 		# at the start of the actor turn.
 * 	<type:enemyTurn>
 * 		# The event is automatically executed 
 * 		# at the start of the enemy turn.
 * 	<type:turnEnd>
 * 		# The event is automatically executed at the end of the turn.
 * 	<type:beforeBattle>
 * 		# The event is automatically executed 
 * 		# just before the start of the battle scene.
 * 	<type:afterAction>
 * 		# The event is automatically executed 
 * 		# at the end of each actor/enemy's action.
 *
 * === tags on Actor ===
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1).
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<specialRange:X>
 * 		# Specialize the shape of the attack range.
 * 		# Referenced if <specialRange:weapon> is set for a skill.
 * 		# The setting method is the same as for skills.
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack.
 * 		# Set to 0 to disable counterattack.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<srpgAlternativeSkillId:X>
 * 		# Specifies the ID of the skill to be used instead 
 * 		# if the action selected for automatic action is determined 
 * 		# not to be used by <simpleAI:X>.
 * 		# If not specified, a normal attack is set.
 * 	<srpgActorCommandList:X>
 * 		# Change actor command.
 * 		# If not specified,
 * 		# it will be the one specified in plugin parameters.
 * 		# Available:attack,skill,item,equip,wait,original(separated by , )
 * 	<srpgActorCommandOriginalId:X> 
 * 		# Specify the ID of the skill to be used 
 * 		# in the actor command "original".
 * 		# If not specified,
 * 		# it will be the one specified in the plugin parameter.
 * 
 * === tags on Class ===
 * 	<srpgMove:X>
 * 		# Set the mobility of the actor in that class to X.
 * 	<srpgThroughTag:X>
 * 		# Can pass through tiles with a terrain tag of X or less 
 * 		# (not valid for terrain tag 0).
 *      # And 'Terrain Cost' of RangeControl.js is also set to 1.
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1).
 * 	<specialRange:X>
 * 		# Specialize the shape of the attack range.
 * 		# Referenced if <specialRange:weapon> is set for a skill.
 * 		# The setting method is the same as for skills.
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack.
 * 		# Set to 0 to disable counterattack.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 *
 * === tags on skills and items ===
 * 	<srpgRange:X>
 * 		# Set the range of that skill to X.
 * 		# Set 0 to make the skill target itself 
 * 		# (range in database should be "user").
 * 		# Set -1 to apply <weaponRange> in the weapon/enemy tag.
 * 	<srpgMinRange:X>
 * 		# Set the minimum range of that skill to X.
 * 	<specialRange:X>
 * 		# Specialize the shape of the range (e.g. <specialRange:queen>).
 * 		# queen : 8 directions, rook : straight, bishop : diagonal, 
 * 		# knight : other than 8 directions, king : square
 * 		# allActor : all actors on the map
 * 		# allEnemy : all enemies on the map
 * 		# weapon : Refer to <specialRange:X> for weapon, enemy, class, actor.
 * 	<addActionTimes: X>
 * 		# Add +X number of action times when the skill is used.
 * 		# If set to 1, the skill can be re-activated after the action.
 * 		# It is recommended to combine with <notUseAfterMove> below, 
 * 		# because if you leave it as it is, it can move many times.
 * 	<notUseAfterMove>
 * 		# After the move, the skill becomes unusable.
 * 	<srpgUncounterable>
 * 		# This will be a skill that the opponent unit cannot counterattack.
 * 	<simpleAI:X>
 * 		# This is a simple AI to be used 
 * 		# when an auto-action actor or an Enemy uses the skill.
 * 		# notUse : AI will not use this skill.
 * 		# oneTime : The skill will be used only once in a turn.
 * 		# If a skill is selected not to be used, it will use the skill
 * 		# specified by <srpgAlternativeSkillId:X> instead.
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1) (assuming a passive skill).
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack 
 * 		# (assumes a passive skill).
 * 		# If set to 0, it will not be able to fight back.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<Cast Animation: 0>
 * 		# Use if you don't want to show animation 
 * 		# when skill is used (when used with YEP_BattleEngineCore.js).
 *
 * === tags on Weapon ===
 * 	<weaponRange:X>
 * 		# Set the range of the weapon to X.
 * 	<weaponMinRange:X>
 * 		# Set the minimum range of the weapon to X.
 * 	<specialRange:X>
 * 		# Specialize the shape of the range.
 * 		# Referenced if the skill has <specialRange:weapon> set.
 * 		# The setting method is the same as for skills.
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1).
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack.
 * 		# If set to 0, it will not be able to fight back.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<srpgMovePlus:X>
 * 		# Change the mobility by the amount of X.
 * 		# Negative values can also be set.
 * 	<srpgThroughTag:X>
 * 		# Can pass through tiles with a terrain tag of X or less 
 * 		# (not valid for terrain tag 0).
 *      # And 'Terrain Cost' of RangeControl.js is also set to 1.
 * 	<srpgCounter:false>
 * 		# Will not fight back against attacks from opponents
 * 		# (different from counter-attack rate).
 * 		# Currently it is recommended to set <srpgReactionSkill:0>, 
 * 		# but left for compatibility.
 * 
 * === tags on Armor ===
 * 	<srpgWRangePlus:X>
 * 		# Change the range of the weapon (normal attack) by the amount of X.
 * 		# Negative values can also be set.
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1).
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack.
 * 		# If set to 0, it will not be able to fight back.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<srpgMovePlus:X>
 * 		# Change the mobility by the amount of X.
 * 		# Negative values can also be set.
 * 	<srpgThroughTag:X>
 * 		# Can pass through tiles with a terrain tag of X or less 
 * 		# (not valid for terrain tag 0).
 *      # And 'Terrain Cost' of RangeControl.js is also set to 1.
 * 
 * === tags on Enemy ===
 * 	<characterName:X>
 * 		# Enter the filename of the character graphic to be used 
 * 		# during SRPG battle in X.
 * 	<characterIndex:X>
 * 		# Enter in X what number of character graphic to use 
 * 		# during SRPG battle.The position in the image file is as follows.
 * 		# 0 1 2 3
 * 		# 4 5 6 7
 * 	<faceName:X>
 * 		# Enter the filename of the face graphic to be used 
 * 		# during SRPG battle in X.
 * 	<faceIndex:X>
 * 		# Enter the number of the face graphic to be used 
 * 		# during SRPG battle in X.
 * 		# The position in the image file is the same as above.
 * 	<srpgClass:X>
 * 		# Enter the class name to be displayed on the SRPG status window in X.
 * 		# This is for display only and has no effect on the actual status.
 * 	<srpgLevel:X>
 * 		# Enter the level to display on the SRPG status window in X.
 * 		# This is for display only and has no effect on the actual status.
 * 	<srpgMove:X>
 * 		# Set the mobility of the enemy to X.
 * 	<weaponRange:X>
 * 		# Set the normal attack range of the enemy to X 
 * 		# (when the enemy is not equipped with a weapon).
 * 	<weaponMinRange:X>
 * 		# Set the minimum range of the enemy's normal attack to X
 * 		# (when the enemy is not equipped with a weapon).
 * 	<srpgWeapon:X>
 * 		# Set X to the ID of the weapon the enemy is equipped with 
 * 		# (affects the enemy's status).
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1).
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack.
 * 		# If set to 0, it will not be able to fight back.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<specialRange:X>
 * 		# Specialize the shape of the range.
 * 		# Referenced if the skill has <specialRange:weapon> set.
 * 		# The setting method is the same as for skills.
 * 	<srpgThroughTag:X>
 * 		# Can pass through tiles with a terrain tag of X or less 
 * 		# (not valid for terrain tag 0).
 *      # And 'Terrain Cost' of RangeControl.js is also set to 1.
 * 	<srpgAlternativeSkillId:X>
 * 		# Specifies the ID of the skill to be used instead if
 * 		# the action selected is determined not to be used by <simpleAI:X>.
 * 		# If not specified, a normal attack is set.
 * 	<srpgCorrectionX:X>
 * 		# Move the battler's display X coordinate by the value of X 
 * 		# in the sideview battle screen.
 * 	<srpgCorrectionY:X>
 * 		# Move the battler's display Y coordinate by the value of X 
 * 		# in the sideview battle screen.
 * 
 * === tags on State ===
 * 	<srpgWRangePlus:X>
 * 		# Change the range of the weapon (normal attack) by the amount of X.
 * 		# Negative values can also be set.
 * 	<srpgWeaponSkill:X>
 * 		# When attacking, use the skill with the ID set by X 
 * 		# instead of the normal attack (ID 1).
 * 	<srpgReactionSkill:X>
 * 		# Use skill with ID set by X in counterattack.
 * 		# If set to 0, it will not be able to fight back.
 * 		# Priority:
 * 		# State > Equipment > Skill > Enemy > 
 * 		# Class > Actor > Plugin Default.
 * 	<srpgMovePlus:X>
 * 		# Change the mobility by the amount of X.
 * 		# Negative values can also be set.
 * 	<srpgThroughTag:X>
 * 		# Can pass through tiles with a terrain tag of X or less 
 * 		# (not valid for terrain tag 0).
 *      # And 'Terrain Cost' of RangeControl.js is also set to 1.
 * 	<srpgWeaponBreak>
 * 		# Weapons are disabled for the duration of that state.
 * 		# If unit is actor, it will not be able to change weapon either.
 * 
 * ============================================================================
 * Processes that can be executed with Event Command > Script.
 * ============================================================================
 * Some frequently used commands can also be executed with the plugin command.
 * 
 * === Commands related to referencing and manipulating 
 * 	 switches and variables                           ===
 * 	this.s(id); 		# refer to a switch of id.
 * 	this.v(id); 		# refer to a variable of id.
 * 	this.sSet(id, value); 	# assign value to the switch of id.
 * 	this.vSet(id, value); 	# assign value to the variable of id.
 * 
 * === Commands to return avtiveEvent and targetEvent ===
 *  Assuming use in battle scene, for somewhat more familiar users.
 * 	this.activeEventId();
 * 		# Returns the event ID of the event being acted upon.
 * 	this.activeBattler();
 * 		# Returns the battler information of the event being acted upon.
 * 	this.targetEventId();
 * 		# Returns the event ID of the target event.
 * 	this.targetBattler();
 * 		# Returns the battler information of the target event.
 * 
 * === Commands to return the distance between units ===.
 * 	this.eventEventDistance(variableId, eventId1, eventId2);
 * 		# Returns the distance between units based on 
 * 		# the event ID to the specified variable.
 * 	this.actorEventDistance(variableId, actorId, eventId);
 * 		# Returns the distance between units based on 
 * 		# actorId and eventId to the specified variable.
 * 	this.actorActorDistance(variableId, actorId1, actorId2);
 * 		# Returns the distance between units based on 
 * 		# the actor ID to the specified variable.
 * 	this.fromActorMinimumDistance(variableId, eventId);
 * 		# Returns the shortest distance between an event with a specific ID
 * 		# and all actors to the specified variable.
 * 	this.checkUserAndTarget(switchId, eventId1, eventId2);
 * 		# Checks if the two specified event IDs match 
 * 		# the event ID in action and the event ID of the target 
 * 		# (same as the one assigned to the variable) 
 * 		# and returns them to the switch.
 * 		# Intended for use in before battle events and in-battle events.
 * 		# Example: Looking at IDs 10 and 20, returns true when 
 * 		# active 10, target 20 or active 20, target 10.
 * 	this.EventDistance(variableId, eventId1, eventId2);
 * 		# Returns the distance between units to the specified variable 
 * 		# based on the event ID.
 * 		# (not recommended for use but left for compatibility).
 * 	this.ActorDistance(variableId, actorId1, actorId2);
 * 		# Returns the distance between units to the specified variable
 * 		# based on the actor ID.
 * 		# (not recommended for use but left for compatibility).
 * 
 * === Commands to return unit status ===
 *  Advanced memo: How to extract unit information from event ID
 * 	var battlerArray = $gameSystem.EventToUnit(eventId);
 * 	battlerArray[0] = 'actor' or 'enemy'
 * 	battlerArray[1] = battler → battler information
 *
 * 	this.isUnitActor(switchId, eventId);
 * 		# Returns to the specified switch whether the event is an actor.
 * 	this.isUnitEnemy(switchId, eventId);
 * 		# Returns to the specified switch whether the event is an enemy.
 * 	this.isUnitId (variableId, eventId);
 * 		# Returns the unit ID of the event to the specified variable.
 * 		# (actor ID if actor, enemy ID if enemy)
 * 	this.isEventIdActor(variableId, actorId);
 * 		# Returns the event ID of the specified actor 
 * 		# to the specified variable.
 * 	this.isUnitParams(variableId, eventId, key);
 * 		# Returns the parameters of the unit with the specified event ID.
 * 		# key : 'level''hp''mp''tp''mhp''mmp''atk''def''mat''mdf''agi''luk'
 * 		#       'hit''eva''cri''cev''mev''mrf''cnt''hrg''mrg''trg''tgr''grd'
 * 		#       'rec''pha''mcr''tcr''pdr''mdr''fdr''exr''move''wRange'
 * 	this.isUnitHp(variableId, eventId);
 * 		# Returns the HP of the event to the specified variable.
 * 		# It is possible with 'isUnitParams', 
 * 		# but HP reference is prepared separately for frequent use.
 * 	this.isUnitStateAffected(switchId, eventId, stateId);
 * 		# Returns to the specified switch 
 * 		# if the event is in a certain state.
 * 	this.isUnitDead(switchId, eventId);
 * 		# Returns whether the event is incompetence(HP 0).
 * 		# It is possible with 'isUnitStateAffected', but determination of
 * 		# incompetence is prepared separately for frequent use.
 * 	this.isActiveEventId(variableId);
 * 		# Returns the event ID of the active event in the specified variable.
 * 		# (same as what you get for the ID specified in the plugin parameter)
 * 		# Assumed to be used in before battle events or in-battle events.
 * 		# Disabled if no event is active.
 * 	this.isActiveEventSkillId(variableId);
 * 		# Returns the id of the skill selected by the active event 
 * 		# in the specified variable.
 * 		# Assumed to be used in before battle events or in-battle events.
 * 		# Disabled if no event is active.
 * 	this.isActiveEventMovedStep(variableId);
 * 		# Returns the number of steps the active event has moved in that turn
 * 		# to the specified variable.
 * 		# Can also be used in damage formulas in the form of 'a.movedStep()'.
 * 		# Assumed to be used in events before battle, during battle, 
 * 		# and in skill's common events.
 * 		# Disabled if no event is active.
 *
 * === Commands related to getting event and unit coordinates ===
 * 	this.isEventIdXy(variableId, x, y);
 * 		# Get the event ID of the unit at the specified coordinates.
 * 	this.checkRegionId(switchId, regionId);
 * 		# Determine if there is an actor unit on the specified region ID.
 *
 * === Commands to change unit status ===
 *  note
 *   Transformation of a unit is possible by 
 *   1) incapacitating the unit before transformation and 
 *   2) reinforcing the unit after transformation.
 * 
 *   Actors' HP increase/decrease and state addition can also be done 
 *   with normal event commands.
 *
 * 	this.unitGainHp(eventId, value, allowDeath);
 * 		# HP increase/decrease of specified event
 * 		# (allowDeath is true or false).
 * 	this.unitGainMp(eventId, value);
 * 		# MP increase/decrease for the specified event.
 * 	this.unitGainTp(eventId, value);
 * 		# TP increase/decrease for the specified event.
 * 	this.unitRecoverAll(eventId);
 * 		# Fully heals the unit with the specified event ID.
 * 	this.unitAddState(eventId, stateId);
 * 		# Adds the specified state to the unit with the event ID
 * 	this.unitRemoveState(eventId, stateId);
 * 		# Removes the specified state of the unit with the event ID.
 * 	this.unitRevive(eventId);
 * 		# Revive the unit with the specified event ID.
 * 		# It is possible with 'unitRemoveState', 
 * 		# but revive is prepared separately for frequent use.
 * 	this.setBattleMode(eventId, mode);
 * 		# Sets the battle mode for the specified event.
 * 	this.setTargetId(eventId, targetId);
 * 		# Sets the target ID for the specified event.
 * 		# The battle mode is referenced by 'aimingEvent' or 'aimingActor'.
 * 	this.unitTurnEnd(eventId);
 * 		# Set the action end flag to the specified event
 * 		# (forcibly end the action).
 * 		# Intended for use in start-of-turn events and player events.
 * 		# Can also be used in skill common events, but is only useful 
 * 		# when used on a actor's skill as the flag is removed immediately.
 * 	this.unitReaction(eventId);
 * 		# Release the action end flag of the specified event (react).
 * 		# If you put "target event ID" in eventId and 
 * 		# use it in the skill's common event, 
 * 		# you can create a skill that causes the target to act again.
 * 
 * === Commands related to unit reinforcements ===
 * 	this.addActor(eventId, actorId);
 * 		# Make the event with eventId a new actor with actorId.
 * 	this.addEnemy(eventId, enemyId);
 * 		# Make the event with eventId the new enemy with enemyId.
 *
 * === Commands related to player operation ===
 * 	this.playerMoveTo(x, y);
 * 		# Move the player (cursor) to the specified coordinates.
 * 	this.playerMoveToEvent(eventId);
 * 		# Moves the player to the coordinates of the event.
 * 		# 0 to specify "this event".
 * 	this.isSubPhaseNormal(switchId);
 * 		# Returns to the switch whether the sub-phase accepts 
 * 		# the player's operation.
 * 		# Assuming combination with picture button plug-in etc.
 * 		# (prevents indiscriminate execution of events).
 * 	this.turnEnd();
 * 		# Forces the actor's turn to end (same as "End Turn" in the menu).
 * 		# Since indiscriminate execution may cause bugs,
 * 		# It is recommended to combine with conditional branching 
 * 		# by 'isSubPhaseNormal(id)'.If you're used to it, 
 * 		# you can combine it with <type:actorTurn> etc.
 *
 * === Commands for setting win/loss conditions ===
 *   What you set here is the content displayed 
 *   in the win/lose conditions window.
 *   The actual decision processing should be created in the event.
 *   You can use the definition of '$gameSystem...' directly,
 *   interpreter is also defined for consistency.
 *
 * 	this.clearWinLoseCondition();
 * 		# Clear win/lose conditions.
 * 	this.setWinCondition(text);
 * 		# Set the text of the victory condition 
 * 		# (text is enclosed in '' Example: 'annihilation of the enemy').
 * 		# Multiple lines can be displayed by executing this multiple times.
 * 	this.setLoseCondition(text);
 * 		# Set the text of the defeat condition 
 * 		# (text is enclosed in '' Example: 'annihilation of allies').
 * 		# Multiple lines can be displayed by executing this multiple times.
 *
 * === Commands related to self-switch operation ===
 * 	this.mapSelfSwitchesControl(tag, value);
 * 		# Manipulate the self-switches of the events present in the map 
 * 		# where the command was executed collectively.
 * 		# It's useful to clear the self-switch with this command 
 * 		# if you use the same map repeatedly.
 * 		# tag: 'A', 'B', 'C', 'D', 'all'
 * 		# value: 'true''on', 'false''off'
 *
 * ============================================================================
 * Supplement when using plug-ins
 * ============================================================================
 * - Trait "Counterattack rate"
 * The trait "counterattack rate" is disabled in SRPG battle.
 * Each unit calculates the range of the skill it uses and stores it 
 * to determine if the target is within range.
 * Since the defending side maintains the range of the skill 
 * used in "counterattack(<srpgReactionSkill:X>)", even if you try to execute 
 * a normal attack to counterattack with the trait "Counterattack Rate", 
 * it will not be possible to determine whether it is possible to attack.
 * In addition, the expression of "counterattack" and 
 * counterattack by trait "counterattack rate" is confusing, 
 * so the trait "counterattack rate" is disabled.
 *
 * The trait "counterattack rate" can be used for the probability of 
 * "counterattack" depending on the plug-in parameter settings.
 * By changing the "counterattack rate" depending on skills and equipment, 
 * you can introduce a mechanism that "counterattack" with a probability.
 *
 * - Map battle (skip battle scene)
 * By switching "Use Map Battle", you can skip the sideview battle scene 
 * and complete the battle on the map.
 *
 * When using battle scenes (normal)
 * 	Advantages:
 * 		- It looks great because it moves to a dedicated screen 
 * 		  and uses character animations.
 * 		- Plug-ins that work in battle scenes can be used as they are.
 *	Disadvantage:
 * 		- Repetition takes time and slows down the tempo of battle.
 *		- need to prepare image for side view battle.
 *
 * When skipping the battle scene (map battle)
 * 	Advantages:
 * 		- Battle progresses at a good tempo.
 * 		- No need to prepare images for side view battles.
 * 	Disadvantage:
 * 		- Plugins that work in battle scenes may stop working 
 * 		  (including SRPG converters).
 * 		- pale in appearance
 * 		(There is also a plugin for animated battles on the map).
 *
 * Whether or not to use map battle can be set by plug-in parameters, and it is 
 * also possible to change it with a switch or option screen during the game.
 * Also, by using the following new tags, 
 * it is possible to set for each skill/item.
 *
 * For advanced users: When processing an event (movement, display, animation, 
 * script call, damage calculation, etc...), use 'actor.event()' to retrieve 
 * the event for which the unit is set. can be called.
 *
 * /!\ Important /!\
 * Some plugins and mechanics may behave differently between map battles 
 * and normal (sideview) battles, especially when using action sequences.
 * Anything that can be used in both, such as counterattacks, should be 
 * thoroughly tested to make sure it works the same.
 * Advanced:
 * When using tags or formulas, '$gameSystem.useMapBattle()' will return true
 * if the skill is used as a map battle.
 * 
 * New skill/item tags:
 * 	<mapBattle:true>
 * 		# This skill will now always be used on the map.
 * 	<mapBattle: false>
 * 		# This skill is no longer used on the map (using sideview battle).
 * 	<targetAnimation:X>
 * 		# Run the animation with ID X on the target event.
 * 	<animationDelay:X>
 * 		# Wait time between animation start and effect execution.
 * 		# Overrides default settings.
 * 	<animationDelay:-1>
 * 		# Wait until the animation finishes before performing the effect.
 * 	<directionalAnimation:X>
 * 		# Change the animation displayed on the target 
 * 		# depending on the user's orientation.
 * 		# Animation IDs are set in order.
 * 		# Example If you set <directionalAnimation:20>:
 * 		# When facing down Animation 20
 * 		# When facing left Animation 21
 * 		# When facing right Animation 22
 * 		# Upward Animation 23
 * 
 * - Higher agility attacks twice (AgiAttackPlus)
 * If you turn on the function with the plug-in, 
 * you will be able to attack twice according to the difference in agility.
 * The second attack occurs after the attacker/defender has acted once.
 * Also, actions that target allies or yourself will not act twice.
 *
 * By changing the srpgAgilityAffectsRatio plugin parameter, 
 * you can change the rate of double attacks.
 * Set to "100% occurrence at X times or more", and the probability changes 
 * according to the difference in agility during that time.
 * 	example:
 * 	srpgAgilityAffectsRatio : 1 
 * 		→ 100% if Agility is 1x or more (same value or more)
 * 	srpgAgilityAffectsRatio : 2 
 * 		→ 100% if Agility is doubled or more
 * 		   25% for 1.25x, 50% for 1.5x.
 * 	srpgAgilityAffectsRatio : 3 
 * 		→ 100% if Agility is 3x or more
 * 		   25% for 1.5x, 50% for 2x
 *
 * New skill tags:
 * 	<doubleAction: false>
 * 		# Unit will not act twice with that skill.
 *
 * @url https://ohisamacraft.nyanta.jp/
 */

/*:ja
 * @target MZ
 * @plugindesc RPGツクールMZでSRPG（タクティクス）方式の戦闘を実行します。SRPGコンバータMVをベースにしています。
 * @author Tkool SRPG team（有明タクミ、RyanBram、Dr.Q、Shoukang、Boomy）
 *
 * @param BasicParam
 * @desc 使用するスイッチ・変数の指定や併用するプラグインの設定など基本的なパラメータを設定します。
 * @default 全体にかかわる基本的な機能
 * 
 * @param WithYEP_BattleEngineCore
 * @parent BasicParam
 * @desc YEP_BattleEngineCoreと併用する場合はtrueに設定してください。
 * @type boolean
 * @default false
 * 
 * @param srpgTroopID
 * @parent BasicParam
 * @desc SRPGコンバータが占有するトループIDです。SRPG戦闘では、このIDのトループが使用されます。
 * @type number
 * @min 1
 * @default 1
 *
 * @param srpgBattleSwitchID
 * @parent BasicParam
 * @desc SRPG戦闘中であるかを格納するスイッチのIDを指定します。戦闘中はONになります。
 * @type switch
 * @default 1
 *
 * @param existActorVarID
 * @parent BasicParam
 * @desc 存在しているアクターの人数が代入される変数のIDを指定します。存在している=戦闘不能・隠れでない。
 * @type variable
 * @default 1
 *
 * @param existEnemyVarID
 * @parent BasicParam
 * @desc 存在しているエネミーの人数が代入される変数のIDを指定します。存在している=戦闘不能・隠れでない。
 * @type variable
 * @default 2
 *
 * @param turnVarID
 * @parent BasicParam
 * @desc 経過ターン数が代入される変数のIDを指定します。最初のターンは『ターン1』です。
 * @type variable
 * @default 3
 *
 * @param activeEventID
 * @parent BasicParam
 * @desc 行動中のユニットのイベントIDが代入される変数のIDを指定します。
 * @type variable
 * @default 4
 *
 * @param targetEventID
 * @parent BasicParam
 * @desc 攻撃対象のユニットのイベントIDが代入される変数のIDを指定します。回復や補助も含みます。
 * @type variable
 * @default 5
 * 
 * @param battleDistanceID
 * @parent BasicParam
 * @desc 戦闘時の攻撃側と防御側のユニットの距離が代入される変数のIDを指定します。回復や補助も含みます。
 * @type variable
 * @default 6
 *
 * @param MapBattle
 * @desc マップバトルに関係するパラメータです。
 * @default マップバトルの設定
 *
 * @param Use Map Battle
 * @parent MapBattle
 * @desc マップバトルを使用するかどうか
 * @type select
 * @option 使用する
 * @value 3
 * @option コンフィグ（メニュー画面のオプション）でオンの時(デフォルトはoff)
 * @value 2
 * @option スイッチがオンの時
 * @value 1
 * @option 使用しない
 * @value 0
 * @default 2
 *
 * @param Map Battle Switch
 * @parent Use Map Battle
 * @desc マップバトルを使用するか決定するスイッチのIDです（Use Map Battleが1の時）
 * @type switch
 * @default 0
 *
 * @param Animation Delay
 * @parent MapBattle
 * @desc アニメーション～効果表示までの待ち時間(Map Battle)
 * -1に設定すると、アニメーションが完了するまで待つ
 * @type number
 * @min -1
 * @default -1
 *
 * @param BattleBasicParam
 * @desc 移動力や経験値の入手割合など基本的な数値を設定します。
 * @default 戦闘で使用する基本的数値
 *
 * @param defaultMove
 * @parent BattleBasicParam
 * @desc アクター/エネミーの移動力のデフォルト値です。
 * @type number
 * @min 0
 * @default 4
 *
 * @param srpgBattleExpRate
 * @parent BattleBasicParam
 * @desc 敵を倒さなかった時に、設定された経験値の何割を入手するか。0 ～ 1.0で設定。
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.4
 *
 * @param srpgBattleExpRateForActors
 * @parent BattleBasicParam
 * @desc 味方に対して行動した時に、レベルアップに必要な経験値の何割を入手するか。0 ～ 1.0で設定。
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.1
 * 
 * @param srpgAutoBattleStateId
 * @parent BattleBasicParam
 * @desc 「オート戦闘」が選ばれた時にアクターに付与するステートのID（0で無効化）。
 * 「ターン終了時に解除」「継続ターン数１～１」「特徴：自動行動」とする。
 * @type state
 * @default 14
 * 
 * @param maxActorVarID
 * @parent BattleBasicParam
 * @desc 戦闘に参加するアクターの最大数を設定する変数のIDを指定します（0で無効化）。
 * @type variable
 * @default 0
 *
 * @param srpgBestSearchRouteSize
 * @parent BattleBasicParam
 * @desc 攻撃可能な対象がいない時、遠距離の敵までのルートを探索します。その索敵距離です（0で無効化）。
 * @type number
 * @min 0
 * @default 25
 *
 * @param BattleExtensionParam
 * @desc 画面の演出やアクターコマンドの変更など拡張的な機能を設定します。
 * @default 戦闘の拡張的な機能
 * 
 * @param srpgActorCommandList
 * @parent BattleExtensionParam
 * @desc アクターコマンドのリストを作成します。
 * 使用可能:attack,skill,item,equip,wait,original(,で区切る)
 * @type string
 * @default attack,skill,item,equip,wait
 * 
 * @param srpgActorCommandOriginalId
 * @parent srpgActorCommandList
 * @desc アクターコマンドのoriginalは、指定したスキルを実行します。そのスキルを指定します。
 * @type skill
 * @default 1
 *
 * @param srpgMenuCommandList
 * @parent BattleExtensionParam
 * @desc 使用可能:turnEnd,autoBattle,winLose,item,skill,equip,
 * status,formation,options,save,gameEnd,original(,で区切る)
 * @type string
 * @default turnEnd,autoBattle,winLose,status,options,save,gameEnd
 *
 * @param srpgPredictionWindowMode
 * @parent BattleExtensionParam
 * @desc 戦闘予測ウィンドウの表示を変更します。(1:フル / 2:攻撃名のみ / 3:表示なし)
 * @type select
 * @option フル
 * @value 1
 * @option 攻撃名のみ
 * @value 2
 * @option 表示なし
 * @value 3
 * @default 1
 *
 * @param useAgiAttackPlus
 * @parent BattleExtensionParam
 * @desc 敏捷が高い方が２回攻撃する仕組みを使用します。
 * @type boolean
 * @default true
 *
 * @param srpgAgilityAffectsRatio
 * @parent useAgiAttackPlus
 * @desc 敏捷性の差が2回攻撃の発生率に影響する比率です。
 * @type number
 * @min 1
 * @default 2
 * 
 * @param srpgAgiAttackPlusPayCost
 * @parent useAgiAttackPlus
 * @desc 2回攻撃時にMPなどのコストを消費するか変更します。
 * @type select
 * @option スキルもアイテムも消費しない
 * @value 1
 * @option スキルのみ消費する
 * @value 2
 * @option アイテムのみ消費する
 * @value 3
 * @option スキルもアイテムも消費する
 * @value 4
 * @default 1
 *
 * @param srpgBattleOrder
 * @parent BattleExtensionParam
 * @desc 戦闘シーンでの行動順を変更します。
 * @type select
 * @option 攻撃側が先攻
 * @value 1
 * @option 敏捷の高い側が先攻
 * @value 2
 * @default 1
 * 
 * @param srpgBattleReaction
 * @parent BattleExtensionParam
 * @desc 戦闘時に攻撃される側が応戦（reaction）するか変更します。
 * @type select
 * @option 必ず応戦する
 * @value 1
 * @option 特徴「反撃率」に応じて応戦する
 * @value 2
 * @option 応戦しない
 * @value 3
 * @default 1
 * 
 * @param srpgDefaultReactionSkill
 * @parent srpgBattleReaction
 * @desc 応戦（reaction）で使用するスキルのデフォルト値を設定します。
 * ID 1「攻撃」では、<srpgWeaponSkill:X>も反映します。
 * @type skill
 * @default 1
 * 
 * @param srpgBattleQuickLaunch
 * @parent BattleExtensionParam
 * @desc 戦闘開始エフェクトを高速化します。falseだと通常と同じになります。(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgNotShowUpDeadActor
 * @parent BattleExtensionParam
 * @desc 戦闘開始時に<id:0>で順次パーティメンバーを参加させる際、戦闘不能になっているアクターを除きます。(true / false)
 * @type boolean
 * @default false
 * 
 * @param srpgBattleEndAllHeal
 * @parent BattleExtensionParam
 * @desc 戦闘終了後に自動的に味方全員を全回復します。falseだと自動回復しません。(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgDamageDirectionChange
 * @parent BattleExtensionParam
 * @desc 攻撃を受けた際に相手の方へ向きを補正します。(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgSkipTargetForSelf
 * @parent BattleExtensionParam
 * @desc 自分自身を対象とする行動では対象選択の処理をスキップします。(true / false)
 * @type boolean
 * @default true
 *
 * @param srpgRangeTerrainTag7
 * @parent BattleExtensionParam
 * @desc 地形タグ７を射程が通らないタイルにします。(true / false)
 * @type boolean
 * @default true
 *
 * @param SRPGTerm
 * @desc 『待機』や『移動力』などの用語を設定します。
 * @default SRPG戦闘で使用する用語
 *
 * @param enemyDefaultClass
 * @parent SRPGTerm
 * @desc エネミーの職業のデフォルト名です（実際には影響しません）。
 * @default エネミー
 *
 * @param textSrpgEquip
 * @parent SRPGTerm
 * @desc 装備（武器）を表す用語です。ＳＲＰＧのステータスウィンドウで表示されます。
 * @default 装備
 *
 * @param textSrpgNone
 * @parent SRPGTerm
 * @desc 装備が無い時に表示される用語
 * @default なし
 *
 * @param textSrpgMove
 * @parent SRPGTerm
 * @desc 移動力を表す用語です。ＳＲＰＧのステータスウィンドウで表示されます。
 * @default 移動力
 *
 * @param textSrpgRange
 * @parent SRPGTerm
 * @desc 攻撃射程を表す用語です。ＳＲＰＧのステータスウィンドウで表示されます。
 * @default 射程
 *
 * @param textSrpgWait
 * @parent SRPGTerm
 * @desc 待機を表す用語です。アクターコマンドウィンドウで表示されます。
 * @default 待機
 *
 * @param textSrpgWinLoseCondition
 * @parent SRPGTerm
 * @desc 勝敗条件を表す用語です。メニューコマンドウィンドウで表示されます。
 * @default 勝敗条件
 *
 * @param textSrpgWinCondition
 * @parent SRPGTerm
 * @desc 勝利条件を表す用語です。勝敗条件ウィンドウで表示されます。
 * @default 勝利条件
 *
 * @param textSrpgLoseCondition
 * @parent SRPGTerm
 * @desc 敗北条件を表す用語です。勝敗条件ウィンドウで表示されます。
 * @default 敗北条件
 *
 * @param textSrpgTurnEnd
 * @parent SRPGTerm
 * @desc ターン終了を表す用語です。メニュー画面で表示されます。
 * @default ターン終了
 *
 * @param textSrpgAutoBattle
 * @parent SRPGTerm
 * @desc オート戦闘を表す用語です。メニュー画面で表示されます。
 * @default オート戦闘
 *
 * @param textSrpgDamage
 * @parent SRPGTerm
 * @desc 戦闘予測ウィンドウで表示するダメージの用語
 * @default ダメージ
 *
 * @param textSrpgHealing
 * @parent SRPGTerm
 * @desc 戦闘予測ウィンドウで表示する回復の用語
 * @default 回復
 * 
 * @param textSrpgOptMapBattle
 * @parent SRPGTerm
 * @desc オプション画面で表示されるマップバトルの用語
 * @default 戦闘シーンのスキップ
 *
 * @param SRPGFiles
 * @desc 戦闘で使用する画像や効果音を指定します。
 * @default SRPG戦闘で使用する画像やSEの設定
 *
 * @param srpgSet
 * @parent SRPGFiles
 * @desc SRPG戦闘で使うカーソルなどのキャラクター画像のファイル名
 * @type file
 * @dir img/characters/
 * @default !srpg_set_type1
 * 
 * @param Path Image
 * @parent SRPGFiles
 * @desc 移動経路の画像のファイル名 (SRPG showPath MZ.jsで使用)
 * @dir img/system/
 * @type file
 * @default srpgPath
 *
 * @param rewardSound
 * @parent SRPGFiles
 * @desc リザルトウィンドウで使用する効果音のファイル名
 * @type file
 * @dir audio/se/
 * @default Item3
 * 
 * @param expSound
 * @parent SRPGFiles
 * @desc リザルトウィンドウでレベルアップ時に使用する効果音のファイル名
 * @type file
 * @dir audio/se/
 * @default Up4
 * 
 * @noteParam characterName
 * @noteDir img/characters/
 * @noteType file
 * @noteData enemies
 * 
 * @noteParam faceName
 * @noteDir img/faces/
 * @noteType file
 * @noteData enemies
 * 
 * ==== plugin command ==== 
 * 
 * @command StartEnd
 * @text SRPG戦闘の開始/終了
 * @desc SRPG戦闘を開始する、または終了します。
 * @arg key
 * @type select
 * @text 開始/終了の切り替え
 * @desc SRPG戦闘の開始/終了は戦闘用のマップで実行してください。
 * @option SRPG戦闘の開始
 * @value start
 * @option SRPG戦闘の終了
 * @value end
 * @default start
 * 
 * @command winLoseCondition
 * @text 勝敗条件文の設定
 * @desc メニューの『勝敗条件』で表示する文章を設定します。
 * @arg key
 * @type select
 * @text 処理の内容
 * @desc 内容のクリア/勝利条件文の設定/敗北条件文の設定を選びます。
 * @option 勝敗条件のクリア
 * @value clear
 * @option 勝利条件の設定
 * @value win
 * @option 敗北条件の設定
 * @value lose
 * @default clear
 * @arg text
 * @type string
 * @text 勝敗条件の文章
 * @desc 勝利条件文/敗北条件文を設定します。複数行作成する場合は複数回実行します。
 * 
 * @command eventEventDistance
 * @text ユニット間の距離の取得
 * @desc イベントIDをもとにユニット間の距離を取得します。
 * @arg variableId
 * @type variable
 * @text 格納変数
 * @desc 距離を格納する変数です。
 * @arg eventId1
 * @type number
 * @text イベントID 1
 * @desc 距離を取得したいユニットのイベントIDです。
 * @min 1
 * @arg eventId2
 * @type number
 * @text イベントID 2
 * @desc 距離を取得したいユニットのイベントIDです。
 * @min 1
 *
 * @command fromActorMinimumDistance
 * @text ユニットとアクターの距離の取得
 * @desc 指定したイベントと最も近いアクターの距離を取得します。
 * @arg variableId
 * @type variable
 * @text 格納変数
 * @desc 距離を格納する変数です。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc ユニットのイベントIDです。このユニットと最も近いアクターの距離を取得します。
 * @min 1
 * 
 * @command checkUserAndTarget
 * @text 行動中/対象のイベントか判定
 * @desc 指定した2つのイベントIDが、行動中または攻撃対象イベントのIDと一致するか調べます。
 *       行動前イベントや戦闘中のイベントでの使用を想定しています。
 * @arg switchId
 * @type switch
 * @text 格納スイッチ
 * @desc 2つのイベントIDが行動中/対象のIDと一致した場合、ON(true)を返します。
 * @arg eventId1
 * @type number
 * @text イベントID 1
 * @desc 行動中または対象かどうか判定したいIDを指定します。
 * @min 1
 * @arg eventId2
 * @type number
 * @text イベントID 2
 * @desc 行動中または対象かどうか判定したいIDを指定します。
 * @min 1
 * 
 * @command isEventIdActor
 * @text アクターのイベントIDを取得
 * @desc 指定したアクターのイベントIDを指定した変数に返します。
 * @arg variableId
 * @type variable
 * @text 格納変数
 * @desc アクターのイベントIDを格納する変数です。
 * @arg actorId
 * @type actor
 * @text アクターID
 * @desc イベントIDを取得したいアクターです。戦闘にいない時は 0 を返します。
 * 
 * @command isUnitHpMpTp
 * @text ユニットのHP/MP/TPを取得
 * @desc 指定したイベントIDのユニットのHP/MP/TPを取得します。
 * @arg variableId
 * @type variable
 * @text 格納変数
 * @desc HP/MP/TPを格納する変数です。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc HP/MP/TPを取得したいユニットのイベントIDです。
 * @min 1
 * @arg key
 * @type select
 * @text HP/MP/TP
 * @desc 取得する値を選択します。
 * @option HP
 * @option MP
 * @option TP
 * @default HP
 * 
 * @command isUnitStateAffected
 * @text ユニットのステートを取得
 * @desc 指定したイベントIDのユニットのステートを取得します。
 * @arg switchId
 * @type switch
 * @text 格納スイッチ
 * @desc ユニットがそのステートの場合、ON(true)を返します。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc ステートを取得したいイベントのIDを指定します。
 * @min 1
 * @arg stateId
 * @type state
 * @text ステート
 * @desc 判定したいステートを指定します。
 * 
 * @command isEventIdXy
 * @text 指定座標のイベントIDの取得
 * @desc 指定したXY座標にいるイベントIDを返します。
 * @arg variableId
 * @type variable
 * @text 格納変数
 * @desc イベントIDを格納する変数です。
 * @arg x
 * @type number
 * @text X座標
 * @desc 参照したいX座標です。マップ左上が(0, 0)です。
 * @min 0
 * @arg y
 * @type number
 * @text Y座標
 * @desc 参照したいY座標です。マップ左上が(0, 0)です。
 * @min 0
 * 
 * @command checkRegionId
 * @text 指定リージョンにアクターがいるかの判定
 * @desc 指定したIDのリージョン上にアクターがいるかを返します。
 * @arg switchId
 * @type switch
 * @text 格納スイッチ
 * @desc 指定したリージョンの上にアクターがいる場合、ON(true)を返します。
 * @arg regionId
 * @type number
 * @text リージョンID
 * @desc アクターがいるか判定したいリージョンのIDです。
 * @max 255
 * @min 0
 * 
 * @command unitGainHpMpTp
 * @text ユニットのHP/MP/TPの操作
 * @desc 指定したイベントIDのユニットのHP/MP/TPを操作します。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc HP/MP/TPを操作したいユニットのイベントIDです。
 * @min 1
 * @arg key
 * @type select
 * @text HP/MP/TP
 * @desc 操作する値を選択します。
 * @option HP
 * @option MP
 * @option TP
 * @default HP
 * @arg symbol
 * @type boolean
 * @text 加算/減算
 * @desc 変更値を加算(+)するか、減算(-)するか設定します。変更値がマイナスの場合、混乱することがあるので注意。
 * @on plus(+)
 * @off minus(-)
 * @arg variableId
 * @type variable
 * @text 変更値（変数）
 * @desc 変更値として参照する変数です。0 にすると下記の変更値（直接指定）が適用されます。
 * @default 0
 * @arg value
 * @type number
 * @text 変更値（直接指定）
 * @desc HP/MP/TPの変更値です。正の値が設定可能です。
 * @arg allowDeath
 * @type boolean
 * @text 戦闘不能の許可
 * @desc 操作の結果HPが 0 になった場合、戦闘不能にするか設定します。
 * @default false
 * 
 * @command unitAddRemoveState
 * @text ユニットのステートの操作
 * @desc 指定したイベントIDのユニットのステートを付与/解除します。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc ステートを付与/解除したいイベントのIDを指定します。
 * @min 1
 * @arg stateId
 * @type state
 * @text ステート
 * @desc 付与/解除したいステートを指定します。
 * @arg key
 * @type select
 * @text 付与/解除
 * @desc 付与か解除かを設定します。
 * @option 付与
 * @value add
 * @option 解除
 * @value remove
 * @default add
 * 
 * @command unitRecoverAll
 * @text ユニットの全回復
 * @desc 指定したイベントIDのユニットを全回復します（生存しているユニットのみ有効）。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc 全回復したいイベントのIDを指定します。
 * @min 1
 * 
 * @command setBattleMode
 * @text 戦闘モードの設定
 * @desc ユニットの戦闘モードを変更します。自動行動時に使われます。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc 戦闘モードを変更したいイベントのIDを指定します。
 * @min 1
 * @arg mode
 * @type select
 * @text 戦闘モード
 * @desc 設定したい戦闘モードを選択します（戦闘モードの詳細はヘルプを参照）。
 * @option normal
 * @option stand
 * @option regionUp
 * @option regionDown
 * @option absRegionUp
 * @option absRegionDown
 * @option aimingEvent
 * @option aimingActor
 * @default normal
 * @arg targetId
 * @type number
 * @text ターゲットID
 * @desc 戦闘モードが'aimingEvent'または'aimingActor'の時のターゲットのIDです。
 * @min 1
 * 
 * @command unitTurnEndReaction
 * @text ユニットの行動終了/再行動の設定
 * @desc 指定したユニットを行動終了にする、または行動終了を解除します。
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc 行動終了/再行動させたいイベントのIDを指定します。
 * @min 1
 * @arg key
 * @type select
 * @text 行動終了/再行動
 * @desc 行動終了させるか再行動させるかを設定します。
 * @option 行動終了
 * @value turnEnd
 * @option 再行動
 * @value reaction
 * @default turnEnd
 * 
 * @command addUnit
 * @text ユニットの追加（増援）
 * @desc 指定したIDのイベントをアクター/エネミーに変化させます。
 * @arg key
 * @type select
 * @text アクター/エネミー
 * @desc アクターかエネミーか選択します。
 * @option アクター
 * @value actor
 * @option エネミー
 * @value enemy
 * @default actor
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc このIDのイベントをユニットに変化させることで増援にします。
 * @min 1
 * @arg actorId
 * @type actor
 * @text アクターID
 * @desc 追加したいアクターです。すでに戦闘に参加しているアクターは追加できません。
 * @arg enemyId
 * @type enemy
 * @text エネミーID
 * @desc 追加したいエネミーです。エネミーは同一IDのユニットがいても追加できます。
 * 
 * @command playerMoveTo
 * @text プレイヤー（カーソル）の移動
 * @desc プレイヤー（カーソル）を指定した位置に移動させます。
 * @arg key
 * @type select
 * @text 移動先の指定法
 * @desc XY座標の指定かイベントの位置かを選択します。
 * @option XY座標
 * @value XY
 * @option イベント
 * @value event
 * @default XY
 * @arg x
 * @type number
 * @text X座標
 * @desc 移動したいX座標です。マップ左上が(0, 0)です。
 * @min 0
 * @arg y
 * @type number
 * @text Y座標
 * @desc 移動したいY座標です。マップ左上が(0, 0)です。
 * @min 0
 * @arg eventId
 * @type number
 * @text イベントID
 * @desc このIDのイベントの位置に移動します。0 で『このイベント』です。
 * @min 0
 * 
 * @command turnEnd
 * @text アクターターンの終了
 * @desc プレイヤーのターンを終わります。メニューが開けるタイミングでのみ有効です。
 *       メニューの『ターン終了』と同じです。
 * 
 * @command mapSelfSwitchesControl
 * @text セルフスイッチの操作
 * @desc そのマップのイベントのセルフスイッチをまとめて操作します。
 *       同じマップを繰り返し利用する場合などに便利です。
 * @arg tag
 * @type select
 * @text 操作するスイッチ
 * @desc セルフスイッチ A ~ D を選びます。allですべて選べます。
 * @option A
 * @option B
 * @option C
 * @option D
 * @option all
 * @arg value
 * @type boolean
 * @text ON/OFF
 * @desc スイッチのON/OFFを選びます。
 *
 * @help
 * copyright 2017 - 2021 Lemon slice all rights reserved.
 * copyright 2022 Takumi Ariake (Tkool SRPG team) all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 概要
 * ============================================================================
 * このプラグインは、RPGツクールMZでSRPG戦闘を作成できるようにする素材集です。
 * Lemon sliceによる『SRPGコンバータMV』をベースに、機能の整理や追加をしています。
 * 本素材集が使用されたサンプルゲームは、非暗号化の状態で公開されており、
 * 制作の参考に使っていただけます。
 * 
 * ============================================================================
 * 導入方法
 * ============================================================================
 * 本プラグイン（SRPG_core_MZ.js）を導入するとともに、
 * 下記の併用“必須”プラグインを導入してください。
 * また、必要な画像を指定されたフォルダにコピーしてください。
 * 
 * SRPGギア/SRPGコンバータの拡張プラグインを導入する場合は、
 * 本プラグイン（SRPG_core_MZ.js）より下に入れるようにしてください。
 * 
 * - 必要な画像
 * characters/!srpg_set_type1.png または !srpg_set_type2.png
 * system/srpgPath.png
 * faces/BigMonster.png (任意)
 * 
 * - 併用“必須”プラグイン
 * SRPG_core_MZと一部の機能を共有しており、導入しないと動作しません。
 * 
 * SRPG_AoE_MZ
 * SRPG_RangeControl_MZ
 * 
 * - 併用“おすすめ”プラグイン
 * 導入しなくても動作しますが、汎用的で多くの人が使いやすいと思われるプラグインです。
 * ただし、この他のSRPGプラグインを否定する、または推奨しないものではありません。
 * また、これらのプラグインは互換性の確認をしており、
 * 必要に応じて、おひさまクラフトが改変を行っています。
 * 
 * SRPG_AIControl_MZ
 * SRPG_AuraSkill_MZ
 * SRPG_BattlePrepare_MZ
 * SRPG_BattleUI_MZ
 * SRPG_DispHPOnMap_MZ
 * SRPG_MoveMethod_MZ (SRPG_AIControl_MZが必要)
 * SRPG_PositionEffects_MZ
 * SRPG_ShowPath_MZ
 * SRPG_Summon_MZ
 * SRPG_UX_Cursor_MZ
 * SRPG_UX_Windows_MZ
 * 
 * ============================================================================
 * このプラグイン内での用語
 * ============================================================================
 * SRPG戦闘:SRPGBattle Startを実行してから行われる戦闘全体のこと
 * 戦闘シーン:sceneBattleで実行されるサイドビュー戦闘、またはマップバトル
 * 応戦：戦闘時に防御側が実行する行動（使用するスキルは個別に設定可能）
 * タグ：メモ欄に記述し、プラグインで参照される内容
 * 
 * ============================================================================
 * プラグインコマンド
 * ============================================================================
 * SRPGギアMZでは、イベントコマンド＞スクリプトで実行できる処理の一部を
 * プラグインコマンドを使うことでより簡単に利用することが出来ます。
 * 
 *   戦闘の開始と終了
 *   イベントIDや距離、ユニットのパラメータの取得
 * 　ユニットのパラメータの操作
 * 　ユニットの追加（増援）　　　　　　　　　　　　　　　など
 * 
 * また、『戦闘の開始と終了』のように、戦闘の進行に重要なコマンドも含まれています。
 * 
 * /!\ 注意 /!\
 * SRPG戦闘中のマップ移動（イベントコマンド『場所移動』）はできません。
 * 戦闘用のマップに移動してから、SRPGBattle Start を実行してください。
 * また、 SRPGBattle End を実行してから、他のマップに移動してください。
 *
 * ============================================================================
 * タグ（メモ）による設定
 * ============================================================================
 * 本素材集では、必要な処理の多くを『メモ』を利用して行います。
 * 各項目のメモに所定のコマンドを書き込むことで、SRPG戦闘で必要な機能を実装します。
 * タグは < > で囲みます。数値や文字列を入れる場合は : の後に続けます。
 * 
 * === イベントのメモ ===
 * - アクター・エネミーの作成
 *   <type:actor>
 *      # そのイベントはアクターになります(<id:X>と組み合わせて使います)。
 *   <type:enemy>
 *      # そのイベントはエネミーになります(<id:X>と組み合わせて使います)。
 *   <id:X>
 *      # Xで指定したIDのアクター/エネミーになります(Xは半角数字）。
 *   <searchItem:true>
 *      # そのイベントがアクターの場合、ユニットイベントが移動範囲内にある時に
 *      # 優先してそこに移動するようになります（1度だけ）。
 *
 * - 行動パターンの設定
 *   <mode:normal>
 *      # そのユニットの行動パターンを「通常」に設定します。
 *      # 最も近くにいる敵ユニットに向けて移動します。
 *      # 行動パターンを設定しない場合、自動で「通常」になります。
 *   <mode:stand>
 *      # 敵ユニットが近づくか、自分がダメージを受けるまでその場で待機します。
 *   <mode:regionUp>
 *      # 敵ユニットが攻撃範囲内にいない場合、より大きなリージョンIDに向かいます。
 *   <mode:regionDown>
 *      # 敵ユニットが攻撃範囲内にいない場合、より小さなリージョンIDに向かいます。
 *   <mode:absRegionUp>
 *      # 常に、より大きなリージョンIDに向かいます。
 *   <mode:absRegionDown>
 *      # 常に、より小さなリージョンIDに向かいます。
 *   <mode:aimingEvent> 
 *      # 指定したIDのイベントを狙います。<targetId:X>と組み合わせて使います。
 *   <mode:aimingActor> 
 *      # 指定したIDのアクターを狙います。<targetId:X>と組み合わせて使います。
 *   <targetId:X>
 *      #  Xで指定したIDのイベント/アクターを狙います。
 *
 * - マップ上のオブジェクトやイベント実行に関係するもの
 *   <type:unitEvent>   
 *      # そのイベントはアクターがその上で行動した時に実行されるようになります。
 *   <type:playerEvent> 
 *      # そのイベントはプレイヤー（カーソル）で決定キーを押した時に実行されます。
 *      # 通過できますが、そのうえで行動は出来ません。
 *   <type:object>      
 *      # そのイベントはアクターもエネミーも通行できない障害物になります。
 *      # 画像が無い場合は通行できます。
 *   <type:battleStart>
 *      # そのイベントはSRPG戦闘開始時に一度だけ自動で実行されます。
 *   <type:actorTurn>
 *      # そのイベントはアクターターンの開始時に自動で実行されます。
 *   <type:enemyTurn>
 *      # そのイベントはエネミーターンの開始時に自動で実行されます。
 *   <type:turnEnd>
 *      # そのイベントはターン終了時に自動で実行されます。
 *   <type:beforeBattle>
 *      # そのイベントは戦闘シーンの開始直前に自動で実行されます。
 *   <type:afterAction>
 *      # そのイベントは各アクター・エネミーの行動終了時に自動で実行されます。
 *
 * === アクターのメモ ===
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、Xで設定したIDのスキルを使用します。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <specialRange:X>
 *      # 攻撃射程の形状を特殊化します。
 *      # スキルに<specialRange:weapon>が設定されている場合に参照されます。
 *      # 設定の方法はスキルと同じです。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、Xで設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <srpgAlternativeSkillId:X>
 *      # 自動行動で選択された行動が<simpleAI:X>によって使用しないと判定された場合
 *      # 代わりに使用するスキルのIDを指定します。
 *      # 指定しない場合、通常攻撃をセットします。
 *   <srpgActorCommandList:X>
 *      # アクターコマンドを変更します。
 *      # 指定しない場合、プラグインパラメータで指定したものになります。
 *      # 使用可能:attack,skill,item,equip,wait,original(,で区切る)
 *   <srpgActorCommandOriginalId:X> 
 *      # アクターコマンドのoriginalで使用するスキルのIDを指定します。
 *      # 指定しない場合、プラグインパラメータで指定したものになります。
 * 
 * === 職業のメモ ===
 *   <srpgMove:X>
 *      # その職業のアクターの移動力をXに設定します。
 *   <srpgThroughTag:X>
 *      # X以下の地形タグが設定されたタイルを通過できます（地形タグ 0 には無効）。
 *      # また、RangeControl.jsの'Terrain Cost'も 1 になります。
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、Xで設定したIDのスキルを使用します。
 *   <specialRange:X>
 *      # 射程の形状を特殊化します。
 *      # スキルに<specialRange:weapon>が設定されている場合に参照されます。
 *      # 設定の方法はスキルと同じです。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、Xで設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *
 * === スキル・アイテムのメモ ===
 *   <srpgRange:X>
 *      # そのスキルの射程を X に設定します。
 *      # srpgRangeを 0 に設定すると
 *      # 自分自身を対象にするスキルになります（範囲は「使用者」にしてください）。
 *      # srpgRangeを -1 に設定すると
 *      # 武器・エネミーのメモの<weaponRange>が適用されます。
 *   <srpgMinRange:X>
 *      # そのスキルの最低射程を X に設定します。
 *   <specialRange:X>
 *      # 射程の形状を特殊化します（例：<specialRange:queen>）。
 *      # queen:8方向、rook:直線、bishop:斜め、knight:8方向以外、king:四角
 *      # allActor : マップ上の全アクター、allEnemy : マップ上の全エネミー
 *      # weapon : 武器、エネミー、職業、アクターの<specialRange:X>を参照します。
 *   <addActionTimes: X>
 *      # スキル発動時に行動回数を +X します。
 *      # 1 にすると行動後に再行動できるスキルになります。
 *      # そのままだと何度も移動できてしまうため、
 *      # 下記の<notUseAfterMove>と組み合わせることを推奨します。
 *   <notUseAfterMove>
 *      # 移動後は使用できないスキルになります。
 *   <srpgUncounterable>
 *      # 相手が応戦できないスキルになります。
 *   <simpleAI:X>
 *      # 自動行動アクター、エネミーがそのスキルを使用する場合に使う簡易AIです。
 *      # notUse : AIはこのスキルを使用しません。
 *      # oneTime : ターン中に１度だけ使用します
 *      # 使用しないスキルが選択された場合、代わりに
 *      # <srpgAlternativeSkillId:X>で指定したスキルを使用します。
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、
 *      # X で設定したIDのスキルを使用します(パッシブスキルを想定)。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、Xで設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <Cast Animation: 0>
 *      # スキル使用時アニメを表示したくない場合に使用します
 *      # （YEP_BattleEngineCore.js併用時）。
 *
 * === 武器のメモ ===
 *   <weaponRange:X>
 *      # その武器の射程を X に設定します。
 *   <weaponMinRange:X>
 *      # その武器の最低射程を X に設定します。
 *   <specialRange:X>
 *      # 射程の形状を特殊化します。
 *      # スキルに<specialRange:weapon>が設定されている場合に参照されます。
 *      # 設定の方法はスキルと同じです。
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、Xで設定したIDのスキルを使用します。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、Xで設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <srpgMovePlus:X>
 *      # X の分だけ移動力を変化させます。マイナスの値も設定可能です。
 *   <srpgThroughTag:X>
 *      # X 以下の地形タグが設定されたタイルを通過できます（地形タグ 0 には無効）。
 *      # また、RangeControl.jsの'Terrain Cost'も 1 になります。
 *   <srpgCounter:false>
 *      # 相手からの攻撃に対して応戦しなくなります（反撃率とは異なる）。
 *      # 現在は<srpgReactionSkill:0>と設定することを推奨していますが、
 *      # 互換性のために残してあります。
 *
 * === 防具のメモ ===
 *   <srpgWRangePlus:X>
 *      # X の分だけ通常攻撃の攻撃射程を変化させます。マイナスの値も設定可能です。
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、X で設定したIDのスキルを使用します。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、X で設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <srpgMovePlus:X>
 *      # Xの分だけ移動力を変化させます。マイナスの値も設定可能です。
 *   <srpgThroughTag:X>
 *      # X以下の地形タグが設定されたタイルを通過できます（地形タグ 0 には無効）。
 *      # また、RangeControl.jsの'Terrain Cost'も 1 になります。
 * 
 * === エネミーのメモ ===
 *   <characterName:X>
 *      # X にSRPG戦闘中に使用するキャラクターグラフィックのファイル名を入力します。
 *   <characterIndex:X>
 *      # X にSRPG戦闘中に使用するキャラクターグラフィックの何番を使うか入力します。
 *      # 画像ファイルの位置で   0 1 2 3
 *      #                       4 5 6 7  となっています。
 *   <faceName:X>
 *      # X にSRPG戦闘中に使用する顔グラフィックのファイル名を入力します。
 *   <faceIndex:X>
 *      # X にSRPG戦闘中に使用する顔グラフィックの何番を使うか入力します。
 *      # 画像ファイルの位置の番号は上記と同様です。
 *   <srpgClass:X>
 *      # X にSRPGのステータス画面で表示するクラス名を入力します。
 *      # 表示のみであり、実際には影響しません。
 *   <srpgLevel:X>
 *      # X にSRPGのステータス画面で表示するレベルを入力します。
 *      # 表示のみであり、実際には影響しません。
 *   <srpgMove:X>
 *      # そのエネミーの移動力を X に設定します。
 *   <weaponRange:X>
 *      # そのエネミーの通常攻撃の射程距離を X に設定します（装備武器未設定時）。
 *   <weaponMinRange:X>
 *      # そのエネミーの通常攻撃の最低射程を X に設定します（装備武器未設定時）。
 *   <srpgWeapon:X>
 *      # そのエネミーが装備する武器のIDを X に設定します（能力に影響します）。
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、X で設定したIDのスキルを使用します。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、X で設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <specialRange:X>
 *      # 射程の形状を特殊化します。
 *      # スキルに<specialRange:weapon>が設定されている場合に参照されます。
 *      # 設定の方法はスキルと同じです。
 *   <srpgThroughTag:X>
 *      # X 以下の地形タグが設定されたタイルを通過できます(地形タグ 0 には無効)。
 *      # また、RangeControl.jsの'Terrain Cost'も 1 になります。
 *   <srpgAlternativeSkillId:X>
 *      # 選択された行動が<simpleAI:X>によって使用しないと判定された場合
 *      # 代わりに使用するスキルのIDを指定します。
 *      # 指定しない場合、通常攻撃をセットします。
 *   <srpgCorrectionX:X>
 *      # サイドビュー戦闘の画面で、バトラーの表示X座標を X の値の分移動させます。
 *   <srpgCorrectionY:X>
 *      # サイドビュー戦闘の画面で、バトラーの表示Y座標を X の値の分移動させます。
 *
 * === ステートのメモ ===
 *   <srpgWRangePlus:X>
 *      # Xの分だけ通常攻撃の攻撃射程を変化させます。マイナスの値も設定可能です。
 *   <srpgWeaponSkill:X>
 *      # 攻撃時に、通常攻撃(ID 1)ではなく、X で設定したIDのスキルを使用します。
 *   <srpgReactionSkill:X>
 *      # 応戦の時、X で設定したIDのスキルを使用します。
 *      # 0 に設定すると応戦不能になります。
 *      # 優先度:
 *      # ステート＞装備＞スキル＞エネミー＞職業＞アクター＞プラグインのデフォルト
 *   <srpgMovePlus:X>
 *      # そのステートの間、X の分だけ移動力を変化させます。
 *      # マイナスの値も設定可能です。
 *   <srpgThroughTag:X>
 *      # X以下の地形タグが設定されたタイルを通過できます(地形タグ 0 には無効)。
 *      # また、RangeControl.jsの'Terrain Cost'も 1 になります。
 *   <srpgWeaponBreak>
 *      # そのステートの間、武器が無効化されます。
 *      # アクターの場合、武器の変更も出来なくなります。
 * 
 * ============================================================================
 * イベントコマンド＞スクリプトで実行できる処理
 * ============================================================================
 * ===スイッチ・変数の参照や操作に関するコマンド===
 *   this.s(id);            # idのスイッチを参照します。
 *   this.v(id);            # idの変数を参照します。
 *   this.sSet(id, value);  # idのスイッチにvalueを代入します。
 *   this.vSet(id, value);  # idの変数にvalueを代入します。
 * 
 * ===avtiveEvent, targetEventを返すコマンド===
 *  戦闘シーンでの使用を想定, やや慣れた人向け
 *   this.activeEventId();
 *      # 行動中のイベントのイベントIDを返します。
 *   this.activeBattler();
 *      # 行動中のイベントのbattler情報を返します。
 *   this.targetEventId();
 *      # 対象のイベントのイベントIDを返します。
 *   this.targetBattler();
 *      # 対象のイベントのbattler情報を返します。
 * 
 * ===ユニット間の距離を返すコマンド===
 *   this.eventEventDistance(variableId, eventId1, eventId2);
 *      # イベントIDをもとに、ユニット間の距離を指定した変数に返します。
 *   this.actorEventDistance(variableId, actorId, eventId);
 *      # アクターIDとイベントIDをもとに、ユニット間の距離を指定した変数に返します。
 *   this.actorActorDistance(variableId, actorId1, actorId2);
 *      # アクターIDをもとに、ユニット間の距離を指定した変数に返します。
 *   this.fromActorMinimumDistance(variableId, eventId);
 *      # 特定のIDのイベントと全アクターの中で最短の距離を指定した変数に返します。
 *   this.checkUserAndTarget(switchId, eventId1, eventId2);
 *      # 指定した2つのイベントIDが、行動中イベントのIDと攻撃対象イベントのID
 *      # （変数に代入されるものと同じもの）と一致するかを調べ、スイッチに返します。
 *      # 行動前イベントや戦闘中のイベントでの使用を想定。
 *      # 例:ID 10 と 20 を調べると、行動中 10, 攻撃対象 20 または
 *      # 行動中 20, 攻撃対象 10 の時にtrueを返します。
 *   this.EventDistance(variableId, eventId1, eventId2);
 *      # イベントIDをもとに、ユニット間の距離を指定した変数に返します。
 *      # (使用を推奨しないが互換性のために残してある)
 *   this.ActorDistance(variableId, actorId1, actorId2);
 *      # アクターIDをもとに、ユニット間の距離を指定した変数に返します。
 *      # (使用を推奨しないが互換性のために残してある)
 * 
 * ===ユニットのステータスを返すコマンド===
 *  上級者向けmemo:イベントIDからユニットの情報を取り出す方法
 *  var battlerArray = $gameSystem.EventToUnit(eventId);
 *  battlerArray[0] = 'actor' または 'enemy'
 *  battlerArray[1] = battler →battlerの情報
 * 
 *   this.isUnitActor(switchId, eventId);
 *      # 指定したイベントがアクターかを指定したスイッチに返します。
 *   this.isUnitEnemy(switchId, eventId);
 *      # 指定したイベントがエネミーかを指定したスイッチに返します。
 *   this.isUnitId (variableId, eventId);
 *      # 指定したイベントのユニットIDを指定した変数に返します。
 *      # （アクターならアクターID、エネミーならエネミーID）
 *   this.isEventIdActor(variableId, actorId);
 *      # 指定したアクターのイベントIDを指定した変数に返します。
 *   this.isUnitParams(variableId, eventId, key);
 *      # 指定したイベントIDのユニットのパラメータを取得します。
 *      # key : 'level''hp''mp''tp''mhp''mmp''atk''def''mat''mdf''agi''luk'
 *      #       'hit''eva''cri''cev''mev''mrf''cnt''hrg''mrg''trg''tgr''grd'
 *      #       'rec''pha''mcr''tcr''pdr''mdr''fdr''exr''move''wRange'
 *   this.isUnitHp(variableId, eventId);
 *      # 指定したイベントのHPを指定した変数に返します。
 *      # isUnitParamsでも可能だが、HPの取得は頻用するため別に用意してあります。
 *   this.isUnitStateAffected(switchId, eventId, stateId);
 *      # 指定したイベントがあるステートになっているか指定したスイッチに返します。
 *   this.isUnitDead(switchId, eventId);
 *      # 指定したイベントが戦闘不能か指定したスイッチに返します。
 *      # isUnitStateAffectedでも可能だが、
 *      # 戦闘不能の判定は頻用するため別に用意してあります。
 *   this.isActiveEventId(variableId);
 *      # 行動中のイベントのイベントIDを指定した変数に返します。
 *      # (プラグインパラメータで指定したIDに取得しているものと同じ)
 *      # 戦闘開始前イベント、もしくは戦闘中のイベントで使用されることを想定。
 *      # 行動中のイベントがいない場合は無効です。
 *   this.isActiveEventSkillId(variableId);
 *      # 行動中のイベントが選択しているスキルのIDを指定した変数に返します。
 *      # 戦闘開始前イベント、もしくは戦闘中のイベントで使用されることを想定。
 *      # 行動中のイベントがいない場合は無効です。
 *   this.isActiveEventMovedStep(variableId);
 *      # 行動中のイベントがそのターンに移動した歩数を指定した変数に返します。
 *      # a.movedStep() の形でダメージ計算式でも使用可能。
 *      # 戦闘開始前や戦闘中のイベント、スキルのコモンイベントでの使用を想定。
 *      # 行動中のイベントがいない場合は無効です。
 * 
 * ===イベントやユニットの座標の取得に関係するコマンド===
 *   this.isEventIdXy(variableId, x, y);
 *      # 指定した座標のユニットのイベントIDを取得します。
 *   this.checkRegionId(switchId, regionId);
 *      # 指定したリージョンID上にアクターユニットがいるか判定します。
 * 
 * ===ユニットのステータスを変更するコマンド===
 *  ポイント
 *  ・ユニットの変身は、変身前のユニットの戦闘不能＋変身後のユニットの増援で可能。
 *  ・アクターのHP増減やステート付与は通常のイベントコマンドでも可能です。
 *   
 *   this.unitGainHp(eventId, value, allowDeath);
 *      # 指定したイベントのHP増減（allowDeathはtrue または false）
 *   this.unitGainMp(eventId, value);
 *      # 指定したイベントのMP増減
 *   this.unitGainTp(eventId, value);
 *      # 指定したイベントのTP増減
 *   this.unitRecoverAll(eventId);
 *      # 指定したイベントIDのユニットを全回復します。
 *   this.unitAddState(eventId, stateId);
 *      # 指定したイベントIDのユニットに指定したステートを付与します。
 *   this.unitRemoveState(eventId, stateId);
 *      # 指定したイベントIDのユニットの指定したステートを解除します。
 *   this.unitRevive(eventId);
 *      # 指定したイベントIDのユニットを復活します。
 *      # unitRemoveStateでも可能だが、
 *      # 戦闘不能からの回復は頻用するため別に用意しています。
 *   this.setBattleMode(eventId, mode);
 *      # 指定したイベントの戦闘モードを設定します。
 *   this.setTargetId(eventId, targetId);
 *      # 指定したイベントのターゲットIDを設定します。
 *      # 戦闘モードが'aimingEvent'または'aimingActor'で参照されます。
 *   this.unitTurnEnd(eventId);
 *      # 指定したイベントに行動終了フラグを設定します（強制的に行動終了にする）。
 *      # ターン開始時のイベントやプレイヤーイベントでの使用を想定。
 *      # スキルのコモンイベントでも使用できますが、直後にフラグが解除されるため
 *      # 味方のスキルで使用した場合にしか有用ではありません。
 *   this.unitReaction(eventId);
 *      # 指定したイベントの行動終了フラグを解除します（再行動させる）。
 *      # eventIdに『対象のイベントID』を入れてスキルのコモンイベントで使用すると、
 *      # 対象を再行動させるスキルを作成できます。
 * 
 * ===ユニットの増援に関係するコマンド===
 *   this.addActor(eventId, actorId);
 *      # eventIdのイベントをactorIdの新規アクターにします。
 *   this.addEnemy(eventId, enemyId);
 *      # eventIdのイベントをenemyIdの新規エネミーにします。
 * 
 * ===プレイヤーの操作に関係するコマンド===
 *   this.playerMoveTo(x, y);
 *      # 指定した座標にプレイヤー(カーソル)を移動します。
 *   this.playerMoveToEvent(eventId);
 *      # 指定したIDのイベントの座標にプレイヤーを移動します。
 *      # 0 で「このイベント」を指定します。
 *   this.isSubPhaseNormal(switchId); 
 *      # プレイヤーの操作を受け付けるサブフェーズかをスイッチに返します。
 *      # ピクチャボタン化プラグインなどとの組み合わせを想定
 *      # （無差別にイベントが実行されるのを防ぐ）。
 *   this.turnEnd();
 *      # アクターターンを強制的に終了します（メニューの「ターン終了」と同じ）。
 *      # 無差別に実行すると不具合の原因になる可能性があるので、
 *      # this.isSubPhaseNormal(id)による条件分岐と組み合わせることを推奨します。
 *      # 慣れていれば、<type:actorTurn>などと組み合わせることも可能です。
 * 
 * ===勝敗条件文の設定に関するコマンド===
 *  ここで設定するものは、勝敗条件ウィンドウで表示する内容です。
 *  実際の判定の処理はイベントで作成する必要があります。
 *  $gameSystem...の定義を直接使うことも出来ますが、
 *  統一するためinterpreterでも定義しています。
 * 
 *   this.clearWinLoseCondition();
 *      # 勝敗条件文をクリアします。
 *   this.setWinCondition(text);
 *      # 勝利条件の文章を設定します（textは''で囲む  例:'敵の全滅'）。
 *      # 複数回実行することで複数行を表示できます。
 *   this.setLoseCondition(text);
 *      # 敗北条件の文章を設定します（textは''で囲む  例:'味方の全滅'）。
 *      # 複数回実行することで複数行を表示できます。
 * 
 * ===セルフスイッチの操作に関係するコマンド===
 *   this.mapSelfSwitchesControl(tag, value);
 *      # コマンドが実行されたマップに存在するイベントの
 *      # セルフスイッチをまとめて操作します。
 *      # 同じマップを繰り返し使用するような場合は、
 *      # このコマンドでセルフスイッチをクリアすると便利です。
 *      # tag:'A', 'B', 'C', 'D', 'all'
 *      # value:'true''on', 'false''off'
 * 
 * ============================================================================
 * プラグイン使用に際しての補足
 * ============================================================================
 * - 特徴「反撃率」 
 *      特徴「反撃率」による反撃は、SRPG戦闘では無効化されています。
 *      各ユニットは、使用するスキルの射程範囲を計算し、保持することで
 *      対象が射程範囲内にいるか適宜判定しています。
 *      防御側は「応戦」で使用するスキルの射程を保持しているため、
 *      特徴「反撃率」による反撃のために通常攻撃を実行しようとしても
 *      攻撃可能か判定することができません。
 *      また、「応戦」と反撃率による反撃の表現が紛らわしく、
 *      混乱の原因にもなることから、特徴「反撃率」を無効化しています。
 * 
 *      特徴「反撃率」は、プラグインパラメータの設定によっては、
 *      「応戦」を行う確率に使用することが可能です。
 *      スキルや装備によって「反撃率」を変更することで
 *      確率で「応戦」するような仕組みを導入することが出来ます。
 * 
 * - マップバトル(戦闘シーンのスキップ)
 *      『Use Map Battle』を切り替えると、戦闘シーンをスキップして、
 *      マップ上で戦闘を完結できるようになります。
 * 
 *      戦闘シーンを使用する場合(通常)
 *        利点:
 *          -専用の画面へ移行して、
 *           キャラクターのアニメーションなども使用するため見栄えがする
 *          -戦闘シーンで動作するプラグインがそのまま利用できる
 *        欠点:
 *          -繰り返していると時間がかかり、戦闘のテンポが悪くなる
 *          -サイドビュー戦闘用の画像を用意する必要がある
 * 
 *      戦闘シーンをスキップする場合(マップバトル)
 *        利点:
 *          -戦闘がテンポよく進む
 *          -サイドビュー戦闘用の画像を用意する必要が無い
 *        欠点:
 *          -戦闘シーンで動作するプラグインが
 *           機能しなくなる可能性がある(SRPGコンバータ関係を含む)
 *          -見栄えという点では見劣りする
 *           (マップ上でアニメーションバトルを行うプラグインもあります)
 * 
 *      マップバトルの使用の有無はプラグインパラメータで設定できるほか、
 *      ゲーム中にスイッチやオプション画面で変更するようにすることも可能です。
 *      また、下記の新規のタグを利用することで、
 *      スキル・アイテムごとに設定することも可能です。
 *
 *      上級者向け：イベントに対して処理を行う場合（移動や表示、アニメーション、
 *      スクリプト呼び出し、ダメージ計算、etc...）、actor.event() を用いることで
 *      そのユニットが設定されているイベントを呼び出すことが出来ます。
 *
 *  /!\ 重要 /!\
 *      一部のプラグインとメカニズムでは、特にアクションシーケンスを使用する場合、
 *      マップバトルと通常のバトルで異なる動作をする可能性があります。
 *      カウンターアタックなど、両方で使用できるものは、すべて徹底的にテストして
 *      同じように機能することを確認する必要があります。
 *      上級者向け:
 *       タグや計算式を用いる際、もしスキルがマップバトルとして使われている場合、
 *       $gameSystem.useMapBattle()は true を返します。
 *
 *   新規のスキル・アイテムのタグ:
 *   <mapBattle:true>
 *      # このスキルは、常にマップ上で使われるようになります。
 *   <mapBattle:false>
 *      # このスキルは、マップ上で使われなくなります(通常の戦闘シーンを使用)。
 *   <targetAnimation:X>
 *      # ターゲットのイベントにID Xのアニメーションを実行します。
 *   <animationDelay:X>
 *      # アニメーション開始と効果実施の間の待ち時間です。
 *      # デフォルト設定より優先されます。
 *   <animationDelay:-1>
 *      # アニメーションが終了するまで、効果実施を待ちます。
 *   <directionalAnimation:X>
 *      # ターゲットに表示するアニメーションを使用者の向きによって変更します。
 *      # アニメーションIDは順番に設定されます.
 *      # 例 <directionalAnimation:20> と設定した場合:
 *      #   下向きの時  Animation 20
 *      #   左向きの時  Animation 21
 *      #   右向きの時  Animation 22
 *      #   上向きの時  Animation 23
 *
 * - 敏捷が高い方が2回攻撃（AgiAttackPlus）
 *      プラグインで機能をONにすると、
 *      敏捷の差に応じて2回攻撃を実行できるようになります。
 *      2回目の攻撃は攻撃側/防御側が1回ずつ行動した後に行われます。
 *      また、味方や自分自身を対象とする行動は2回行動を行いません。
 * 
 *      プラグインパラメータのsrpgAgilityAffectsRatioを変えることで
 *      2回攻撃の発生率を変えられます。
 *      「X倍以上で100%発生する」と設定し、
 *      その間は敏捷性の差に応じて確率が変わります。
 *      例:
 *      srpgAgilityAffectsRatio : 1 → 敏捷性が1倍以上（同値以上）なら100%
 *      srpgAgilityAffectsRatio : 2 → 敏捷性が2倍以上なら100%
 *                                    1.25倍なら25%、1.5倍なら50%。
 *      srpgAgilityAffectsRatio : 3 → 敏捷性が3倍以上なら100%
 *                                    1.5倍なら25%、2倍なら50%
 * 
 *   新規のスキルのタグ:
 *   <doubleAction:false>
 *      # そのスキルでは2回行動しなくなります。
 * 
 * @url https://ohisamacraft.nyanta.jp/
 */

//====================================================================
// ●Function Declaration
//====================================================================
// SRPG戦闘用のステータスウィンドウ
function Window_SrpgStatus() {
    this.initialize(...arguments);
}

Window_SrpgStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_SrpgStatus.prototype.constructor = Window_SrpgStatus;

// アクター行動中の簡易ステータスウィンドウ
function Window_SrpgActorCommandStatus() {
    this.initialize(...arguments);
}

Window_SrpgActorCommandStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_SrpgActorCommandStatus.prototype.constructor = Window_SrpgActorCommandStatus;

// 戦闘シーン用のステータスウィンドウ
function Window_SrpgBattleStatus() {
    this.initialize(...arguments);
}

Window_SrpgBattleStatus.prototype = Object.create(Window_StatusBase.prototype);
Window_SrpgBattleStatus.prototype.constructor = Window_SrpgBattleStatus;

// リザルトウィンドウ
function Window_SrpgBattleResult() {
    this.initialize(...arguments);
}

Window_SrpgBattleResult.prototype = Object.create(Window_StatusBase.prototype);
Window_SrpgBattleResult.prototype.constructor = Window_SrpgBattleResult;

// 戦闘結果予測ウィンドウ
function Window_SrpgPrediction() {
    this.initialize(...arguments);
}

Window_SrpgPrediction.prototype = Object.create(Window_Base.prototype);
Window_SrpgPrediction.prototype.constructor = Window_SrpgPrediction;

// 戦闘開始選択ウィンドウ
function Window_SrpgBattle() {
    this.initialize(...arguments);
}

Window_SrpgBattle.prototype = Object.create(Window_HorzCommand.prototype);
Window_SrpgBattle.prototype.constructor = Window_SrpgBattle;

// 勝敗条件ウィンドウ
function Window_WinLoseCondition() {
    this.initialize(...arguments);
}

Window_WinLoseCondition.prototype = Object.create(Window_Base.prototype);
Window_WinLoseCondition.prototype.constructor = Window_WinLoseCondition;

// 移動範囲表示スプライト
function Sprite_SrpgMoveTile() {
    this.initialize(...arguments);
}

Sprite_SrpgMoveTile.prototype = Object.create(Sprite.prototype);
Sprite_SrpgMoveTile.prototype.constructor = Sprite_SrpgMoveTile;

//====================================================================
// ●Plugin
//====================================================================
(() => {
    const pluginName = "SRPG_core_MZ";

    var parameters = PluginManager.parameters('SRPG_core_MZ');
    var _AAPwithYEP_BattleEngineCore = parameters['WithYEP_BattleEngineCore'] || 'false';
    var _srpgTroopID = Number(parameters['srpgTroopID'] || 1);
    var _srpgBattleSwitchID = Number(parameters['srpgBattleSwitchID'] || 1);
    var _existActorVarID = Number(parameters['existActorVarID'] || 1);
    var _existEnemyVarID = Number(parameters['existEnemyVarID'] || 2);
    var _turnVarID = Number(parameters['turnVarID'] || 3);
    var _activeEventID = Number(parameters['activeEventID'] || 4);
    var _targetEventID = Number(parameters['targetEventID'] || 5);
    var _maxActorVarID = Number(parameters['maxActorVarID'] || 0);
    var _battleDistanceID = Number(parameters['battleDistanceID'] || 6);
    var _defaultMove = Number(parameters['defaultMove'] || 4);
    var _srpgBattleExpRate = Number(parameters['srpgBattleExpRate'] || 0.4);
    var _srpgBattleExpRateForActors = Number(parameters['srpgBattleExpRateForActors'] || 0.1);
    var _srpgAutoBattleStateId = Number(parameters['srpgAutoBattleStateId'] || 14);
    var _srpgBestSearchRouteSize = Number(parameters['srpgBestSearchRouteSize'] || 25);
    var _enemyDefaultClass = parameters['enemyDefaultClass'] || 'エネミー';
    var _srpgActorCommandList = parameters['srpgActorCommandList'] || 'attack,skill,item,equip,wait';
    var _srpgActorCommandOriginalId = Number(parameters['srpgActorCommandOriginalId'] || 1);
    var _srpgMenuCommandList = parameters['srpgMenuCommandList'] || 'turnEnd,autoBattle,item,skill,equip,status,WinLose,options,save,gameEnd';
    var _useMapBattle = Number(parameters['Use Map Battle'] || 2);
    var _mapBattleSwitch = Number(parameters['Map Battle Switch'] || 0);
    var _animDelay = Number(parameters['Animation Delay'] || -1);
    var _srpgBattleOrder = Number(parameters['srpgBattleOrder'] || 1);
    var _srpgUseAgiAttackPlus = parameters['useAgiAttackPlus'] || 'true';
    var _srpgAgilityAffectsRatio = Number(parameters['srpgAgilityAffectsRatio'] || 2);
    var _srpgAgiAttackPlusPayCost = Number(parameters['srpgAgiAttackPlusPayCost'] || 1);
    var _srpgBattleReaction = Number(parameters['srpgBattleReaction'] || 1);
    var _srpgDefaultReactionSkill = Number(parameters['srpgDefaultReactionSkill'] || 1);
    var _srpgBattleQuickLaunch = parameters['srpgBattleQuickLaunch'] || 'true';
    var _srpgNotShowUpDeadActor = parameters['srpgNotShowUpDeadActor'] || 'false';
    var _srpgBattleEndAllHeal = parameters['srpgBattleEndAllHeal'] || 'true';
    var _srpgPredictionWindowMode = Number(parameters['srpgPredictionWindowMode'] || 1);
    var _srpgDamageDirectionChange = parameters['srpgDamageDirectionChange'] || 'true';
    var _srpgSkipTargetForSelf = parameters['srpgSkipTargetForSelf'] || 'true';
    var _srpgRangeTerrainTag7 = parameters['srpgRangeTerrainTag7'] || 'true';
    var _textSrpgEquip = parameters['textSrpgEquip'] || '装備';
    var _textSrpgMove = parameters['textSrpgMove'] || '移動力';
    var _textSrpgRange = parameters['textSrpgRange'] || '射程';
    var _textSrpgWait = parameters['textSrpgWait'] || '待機';
    var _textSrpgTurnEnd = parameters['textSrpgTurnEnd'] || 'ターン終了';
    var _textSrpgAutoBattle = parameters['textSrpgAutoBattle'] || 'オート戦闘';
    var _textSrpgDamage = parameters['textSrpgDamage'] || 'ダメージ';
    var _textSrpgHealing = parameters['textSrpgHealing'] || '回復';
    var _textSrpgOptMapBattle = parameters['textSrpgOptMapBattle'] || '戦闘シーンのスキップ';
    var _textSrpgNone = parameters['textSrpgNone'] || 'なし';
    var _textSrpgWinLoseCondition = parameters['textSrpgWinLoseCondition'] || '勝敗条件';
    var _textSrpgWinCondition = parameters['textSrpgWinCondition'] || '勝利条件';
    var _textSrpgLoseCondition = parameters['textSrpgLoseCondition'] || '敗北条件';
    var _srpgSet = parameters['srpgSet'] || '!srpg_set_type1';
    var _rewardSe = parameters['rewardSound'] || 'Item3';
    var _expSe = parameters['expSound'] || 'Up4';

//====================================================================
// ●Plugin Command
//====================================================================
    PluginManager.registerCommand(pluginName, "StartEnd", function(args) {
        switch (args.key) {
            case 'start':
                $gameSystem.startSRPG();
                break;
            case 'end':
                $gameSystem.endSRPG();
                break;
        }
    });
    
    PluginManager.registerCommand(pluginName, "eventEventDistance", function(args) {
        this.eventEventDistance(Number(args.variableId), Number(args.eventId1), Number(args.eventId2));
    });

    PluginManager.registerCommand(pluginName, "fromActorMinimumDistance", function(args) {
        this.fromActorMinimumDistance(Number(args.variableId), Number(args.eventId));
    });

    PluginManager.registerCommand(pluginName, "checkUserAndTarget", function(args) {
        this.checkUserAndTarget(Number(args.switchId), Number(args.eventId1), Number(args.eventId2));
    });

    PluginManager.registerCommand(pluginName, "isEventIdActor", function(args) {
        this.isEventIdActor(Number(args.variableId), Number(args.actorId));
    });

    PluginManager.registerCommand(pluginName, "isUnitHpMpTp", function(args) {
        switch (args.key) {
            case 'HP':
                this.isUnitParams(Number(args.variableId), Number(args.eventId), 'hp');
                break;
            case 'MP':
                this.isUnitParams(Number(args.variableId), Number(args.eventId), 'mp');
                break;
            case 'TP':
                this.isUnitParams(Number(args.variableId), Number(args.eventId), 'tp');
                break;
        }
        return true;
    });

    PluginManager.registerCommand(pluginName, "isUnitStateAffected", function(args) {
        this.isUnitStateAffected(Number(args.switchId), Number(args.eventId), Number(args.stateId));
    });

    PluginManager.registerCommand(pluginName, "isEventIdXy", function(args) {
        this.isEventIdXy(Number(args.variableId), Number(args.x), Number(args.y));
    });

    PluginManager.registerCommand(pluginName, "checkRegionId", function(args) {
        this.checkRegionId(Number(args.switchId), Number(args.regionId));
    });

    PluginManager.registerCommand(pluginName, "unitGainHpMpTp", function(args) {
        const symbol = (args.symbol === 'true') ? true : false;
        const allowDeath = (args.allowDeath === 'true') ? true : false;
        if (Number(args.variableId) === 0) {
            var value = Number(args.value);
        } else {
            var value = $gameVariables.value(args.variableId);
        }
        if (symbol === false) value *= -1;
        switch (args.key) {
            case 'HP':
                this.unitGainHp(Number(args.eventId), value, allowDeath);
                break;
            case 'MP':
                this.unitGainMp(Number(args.eventId), value);
                break;
            case 'TP':
                this.unitGainTp(Number(args.eventId), value);
                break;
        }
        return true;
    });

    PluginManager.registerCommand(pluginName, "unitAddRemoveState", function(args) {
        if (args.key === 'add') {
            this.unitAddState(Number(args.eventId), Number(args.stateId));
        } else {
            this.unitRemoveState(Number(args.eventId), Number(args.stateId));
        }
    });

    PluginManager.registerCommand(pluginName, "unitRecoverAll", function(args) {
        this.unitRecoverAll(Number(args.eventId));
    });

    PluginManager.registerCommand(pluginName, "setBattleMode", function(args) {
        this.setBattleMode(Number(args.eventId), args.mode);
        if (args.mode === 'aimingEvent' || args.mode === 'aimingActor') {
            this.setTargetId(Number(args.eventId), Number(args.targetId));
        }
    });

    PluginManager.registerCommand(pluginName, "unitTurnEndReaction", function(args) {
        if (args.key === 'turnEnd') {
            this.unitTurnEnd(Number(args.eventId));
        } else {
            this.unitReaction(Number(args.eventId));
        }
    });

    PluginManager.registerCommand(pluginName, "addUnit", function(args) {
        if (args.key === 'actor') {
            this.addActor(Number(args.eventId), Number(args.actorId));
        } else {
            this.addEnemy(Number(args.eventId), Number(args.enemyId));
        }
    });

    PluginManager.registerCommand(pluginName, "playerMoveTo", function(args) {
        if (args.key === 'XY') {
            this.playerMoveTo(Number(args.x), Number(args.y));
        } else {
            this.playerMoveToEvent(Number(args.eventId));
        } 
    });

    PluginManager.registerCommand(pluginName, "turnEnd", function(args) {
        if ($gameSystem.isBattlePhase() === 'actor_phase' && $gameSystem.isSubBattlePhase() === 'normal') {
            this.turnEnd();
        }
    });

    PluginManager.registerCommand(pluginName, "winLoseCondition", function(args) {
        if (args.key === 'clear') {
            this.clearWinLoseCondition();
        } else if (args.key === 'win') {
            this.setWinCondition(String(args.text));
        } else {
            this.setLoseCondition(String(args.text));
        }
    });

    PluginManager.registerCommand(pluginName, "mapSelfSwitchesControl", function(args) {
        const value = (args.value === 'true') ? true : false;
        this.mapSelfSwitchesControl(args.tag, value);
    });

//====================================================================
// ●Game_Temp
//====================================================================
    //----------------------------------------------------------------
    // 初期化処理
    //----------------------------------------------------------------
    var _SRPG_Game_Temp_initialize = Game_Temp.prototype.initialize;
    Game_Temp.prototype.initialize = function() {
    _SRPG_Game_Temp_initialize.call(this);
    this._MoveTable = [];
    this._MoveList = [];
    this._RangeTable = [];
    this._RangeList = [];
    this._ResetMoveList = false;
    this._SrpgDistance = 0;
    this._ActiveEvent = null;
    this._TargetEvent = null;
    this._OriginalPos = [];
    this._SrpgEventList = [];
    this._autoMoveDestinationValid = false;
    this._autoMoveDestinationX = -1;
    this._autoMoveDestinationY = -1;
    this._srpgLoadFlag = false;
    this._srpgActorEquipFlag = false;
    this._srpgTurnEndFlag = false;
    this._srpgSearchLongDistance = false;
    this._srpgMoveTileInvisible = false;
    this._srpgPriorityTarget = null;
    this._srpgAllTargetInRange = false;
    };

    //----------------------------------------------------------------
    // 移動と射程に関する変数の処理
    //----------------------------------------------------------------
    // 移動範囲と移動経路を記録する配列変数を返す
    // MoveTable, RangeTableは二次元配列になっており、XY座標に対応する要素に移動力と経路を保存している。
    Game_Temp.prototype.MoveTable = function(x, y) {
        return this._MoveTable[x][y];
    };

    // 移動範囲を設定する
    Game_Temp.prototype.setMoveTable = function(x, y, move, route) {
        this._MoveTable[x][y] = [move, route];
    };

    // 攻撃射程と計算経路を記録する配列変数を返す
    Game_Temp.prototype.RangeTable = function(x, y) {
        return this._RangeTable[x][y];
    };

    // 攻撃射程を設定する
    // 移動範囲の計算と同様に攻撃範囲を設定する
    Game_Temp.prototype.setRangeTable = function(x, y, move, route) {
        this._RangeTable[x][y] = [move, route];
    };

    // 移動範囲と攻撃範囲を初期化する
    Game_Temp.prototype.clearMoveTable = function() {
        this._MoveTable = [];
        this._MoveList = [];
        for (var i = 0; i < $dataMap.width; i++) {
          var vartical = [];
          for (var j = 0; j < $dataMap.height; j++) {
            vartical[j] = [-1, []];
          }
          this._MoveTable[i] = vartical;
        }
        this.clearRangeTable();
    };

    // 攻撃範囲を初期化する(RangeTable)
    Game_Temp.prototype.clearRangeTable = function() {
        this._RangeTable = [];
        this._RangeList = [];
        for (var i = 0; i < $dataMap.width; i++) {
            var vartical = [];
            for (var j = 0; j < $dataMap.height; j++) {
                vartical[j] = [-1, []];
            }
            this._RangeTable[i] = vartical;
        }
        $gameTemp.setSrpgAllTargetInRange(false);
    };

    // 行動するユニット自身の直下は常に歩けるようにする（範囲計算の前に行う）
    Game_Temp.prototype.initialMoveTable = function(oriX, oriY, oriMove) {
        this.setMoveTable(oriX, oriY, oriMove, [0]);
        this.pushMoveList([oriX, oriY, false]); // false = move tile
    }

    // 行動するユニット自身の直下は常に攻撃射程に含める（範囲計算の前に行う）
    Game_Temp.prototype.initialRangeTable = function(oriX, oriY, oriMove) {
        this.setRangeTable(oriX, oriY, oriMove, [0]);
        this.pushRangeList([oriX, oriY, true]); // true = range tile
    }

    // 移動可能な座標のリストを返す(移動範囲表示で使用)
    Game_Temp.prototype.moveList = function() {
        return this._MoveList;
    };

    // 移動可能な座標のリストに追加する
    // 移動範囲の情報を範囲表示スプライトで利用できる形に変換し、保存する
    // MoveTable, RangeTableとは異なり、XY座標を要素とした一次元配列となっている。
    Game_Temp.prototype.pushMoveList = function(xy) {
        this._MoveList.push(xy);
    };

    // 座標リストにデータが入っているか返す
    Game_Temp.prototype.isMoveListValid = function() {
        // 長距離探索の時は範囲表示を行わない
        if (this._srpgMoveTileInvisible === true) return false; 
        else return this._MoveList.length > 0;
    };

    // 攻撃可能な座標のリストを返す(攻撃射程表示で使用)
    Game_Temp.prototype.rangeList = function() {
        return this._RangeList;
    };

    // 攻撃可能な座標のリストに追加する
    Game_Temp.prototype.pushRangeList = function(xy) {
        this._RangeList.push(xy);
    };

    // 移動範囲の配列に射程範囲の配列を結合する
    // 移動範囲と攻撃範囲を同時に表示するための処理
    Game_Temp.prototype.pushRangeListToMoveList = function() {
        Array.prototype.push.apply(this._MoveList, this._RangeList);
    };

    // 射程範囲から最低射程を除く
    Game_Temp.prototype.minRangeAdapt = function(oriX, oriY, minRange) {
        var newList = [];
        for (var i = 0; i < this._RangeList.length; i++) {
            var x = this._RangeList[i][0];
            var y = this._RangeList[i][1];
            var dis = Math.abs(x - oriX) + Math.abs(y - oriY);
            if (dis >= minRange) {
                newList.push(this._RangeList[i]);
            }
        }
        this._RangeList = [];
        this._RangeList = newList;
    };

    // 移動範囲のスプライト消去のフラグを返す
    Game_Temp.prototype.resetMoveList = function() {
        return this._ResetMoveList;
    };

    // 移動範囲のスプライト消去のフラグを設定する
    Game_Temp.prototype.setResetMoveList = function(flag) {
        this._ResetMoveList = flag;
    };

    // 移動範囲を一時的に消去するフラグを返す
    Game_Temp.prototype.isSrpgMoveTileInvisible = function() {
        return this._srpgMoveTileInvisible;
    };

    // 移動範囲を一時的に消去するフラグを設定する
    Game_Temp.prototype.setSrpgMoveTileInvisible = function(flag) {
        this._srpgMoveTileInvisible = flag;
    };

    // 射程内の全対象を選択しているフラグを返す
    Game_Temp.prototype.isSrpgAllTargetInRange = function() {
        return this._srpgAllTargetInRange;
    };

    // 射程内の全対象を選択しているフラグを設定する
    Game_Temp.prototype.setSrpgAllTargetInRange = function(flag) {
        this._srpgAllTargetInRange = flag;
    };

    //----------------------------------------------------------------
    // 行動中・対象のイベントに関する処理
    //----------------------------------------------------------------
    // 行動中のイベントを返す
    Game_Temp.prototype.activeEvent = function() {
        return this._ActiveEvent;
    };

    // 行動中のイベントを設定する
    Game_Temp.prototype.setActiveEvent = function(event) {
        this._ActiveEvent = event;
        $gameVariables.setValue(_activeEventID, event.eventId()); 
    };

    // 行動中のイベントを初期化する
    Game_Temp.prototype.clearActiveEvent = function() {
        this._ActiveEvent = null;
        $gameVariables.setValue(_activeEventID, 0);
    };

    // 行動対象となっているイベントを返す
    Game_Temp.prototype.targetEvent = function() {
        return this._TargetEvent;
    };

    // 行動対象となっているイベントを設定する
    Game_Temp.prototype.setTargetEvent = function(event) {
        this._TargetEvent = event;
        if (this._TargetEvent) {
            $gameVariables.setValue(_targetEventID, event.eventId()); 
        }
    };

    // 行動対象となっているイベントを初期化する
    Game_Temp.prototype.clearTargetEvent = function() {
        this._TargetEvent = null;
        $gameVariables.setValue(_targetEventID, 0);
    };

    // 行動中のイベントと対象の距離を返す
    Game_Temp.prototype.SrpgDistance = function() {
        return this._SrpgDistance;
    };

    // 行動中のイベントと対象の距離を設定する
    Game_Temp.prototype.setSrpgDistance = function(val) {
        this._SrpgDistance = val;
        $gameVariables.setValue(_battleDistanceID, val);
    };

    // 行動中のイベントの元々の座標（移動前の座標）を返す
    // キャンセルなどで元の座標に戻すときに利用する
    Game_Temp.prototype.originalPos = function() {
        return this._OriginalPos;
    };

    // 行動中のイベントの元々の座標（移動前の座標）を設定する
    Game_Temp.prototype.reserveOriginalPos = function(x, y) {
        this._OriginalPos = [x, y];
    };

    //----------------------------------------------------------------
    // イベントの実行に関する処理
    //----------------------------------------------------------------
    // 実行待ちイベントリストを確認する
    Game_Temp.prototype.isSrpgEventList = function() {
        return this._SrpgEventList.length > 0;
    };

    // 実行待ちイベントリストを追加する
    Game_Temp.prototype.pushSrpgEventList = function(event) {
        this._SrpgEventList.push(event);
    };

    // 実行待ちイベントリストの先頭を取得し、前に詰める
    Game_Temp.prototype.shiftSrpgEventList = function() {
        var event = this._SrpgEventList[0];
        this._SrpgEventList.shift();
        return event;
    };

    //----------------------------------------------------------------
    // 戦闘や処理の進行に関するフラグ処理
    //----------------------------------------------------------------
    // プレイヤーの自動移動フラグを返す
    Game_Temp.prototype.isAutoMoveDestinationValid = function() {
        return this._autoMoveDestinationValid;
    };

    // プレイヤーの自動移動フラグを設定する
    Game_Temp.prototype.setAutoMoveDestinationValid = function(val) {
        this._autoMoveDestinationValid = val;
    };

    // プレイヤーの自動移動先を返す(X)
    Game_Temp.prototype.autoMoveDestinationX = function() {
        return this._autoMoveDestinationX;
    };

    // プレイヤーの自動移動先を返す(Y)
    Game_Temp.prototype.autoMoveDestinationY = function() {
        return this._autoMoveDestinationY;
    };

    // プレイヤーの自動移動先を設定する
    Game_Temp.prototype.setAutoMoveDestination = function(x, y) {
        this._autoMoveDestinationX = x;
        this._autoMoveDestinationY = y;
    };

    // 戦闘中にセーブデータをロードしたフラグを返す
    Game_Temp.prototype.isSrpgLoadFlag = function() {
        return this._srpgLoadFlag;
    };

    // 戦闘中にセーブデータをロードしたフラグを設定する
    Game_Temp.prototype.setSrpgLoadFlag = function(flag) {
        this._srpgLoadFlag = flag;
    };

    // ターン終了フラグを返す
    Game_Temp.prototype.isTurnEndFlag = function() {
        return this._srpgTurnEndFlag;
    };

    // ターン終了フラグを変更する
    Game_Temp.prototype.setTurnEndFlag = function(flag) {
        this._srpgTurnEndFlag = flag;
    };

    // オート戦闘フラグを返す
    Game_Temp.prototype.isAutoBattleFlag = function() {
        return this._SrpgAutoBattleFlag;
    };

    // オート戦闘フラグを変更する
    Game_Temp.prototype.setAutoBattleFlag = function(flag) {
        this._SrpgAutoBattleFlag = flag;
    };

    // アクターコマンドから装備を呼び出したフラグを返す
    Game_Temp.prototype.isSrpgActorEquipFlag = function() {
        return this._srpgActorEquipFlag;
    };

    // アクターコマンドから装備を呼び出したフラグを設定する
    Game_Temp.prototype.setSrpgActorEquipFlag = function(flag) {
        this._srpgActorEquipFlag = flag;
    };

    // 長距離探索を行うフラグを返す
    Game_Temp.prototype.isSrpgSearchLongDistance = function() {
        return this._srpgSearchLongDistance;
    };

    // 長距離探索を行うフラグを設定する
    Game_Temp.prototype.setSrpgSearchLongDistance = function(flag) {
        this._srpgSearchLongDistance = flag;
    };

    // 優先ターゲットを返す
    Game_Temp.prototype.isSrpgPriorityTarget = function() {
        return this._srpgPriorityTarget;
    };

    // 優先ターゲットを設定する
    Game_Temp.prototype.setSrpgPriorityTarget = function(event) {
        this._srpgPriorityTarget = event;
    };

//====================================================================
// ●Game_System
//====================================================================
    //----------------------------------------------------------------
    // 初期化処理
    //----------------------------------------------------------------
    var _SRPG_Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _SRPG_Game_System_initialize.call(this);
        this._SRPGMode = false;
        this._isBattlePhase = 'initialize';
        this._isSubBattlePhase = 'initialize';
        this._AutoUnitId = 0;
        this._EventToUnit = [];
        this._SrpgStatusWindowRefreshFlag = [false, null];
        this._SrpgBattleWindowRefreshFlag = [false, null, null];
        this._SrpgWaitMoving = false;
        this._SrpgActorCommandWindowRefreshFlag = [false, null];
        this._SrpgActorCommandStatusWindowRefreshFlag = [false, null];
        this._srpgAllActors = []; // SRPGモードに参加する全てのアクターの配列
        this._searchedItemList = [];
        this._SrpgWinLoseCondition = [];
    };

    //イベントIDに対応するアクター・エネミーデータを初期化する
    Game_System.prototype.clearData = function() {
        this._EventToUnit = [];
        $gameSystem.clearSrpgAllActors();
    };

    //----------------------------------------------------------------
    // SRPG戦闘の開始に関係する処理
    //----------------------------------------------------------------
    // SRPG戦闘の開始処理（プラグイン・コマンド）
    Game_System.prototype.startSRPG = function() {
        this._SRPGMode = true; // SRPG戦闘中のフラグをオンにする
        $gameSwitches.setValue(_srpgBattleSwitchID, true);// SRPG戦闘中のフラグはスイッチにも代入する
        this._isBattlePhase = 'initialize';
        this._isSubBattlePhase = 'initialize';
        $gamePlayer.refresh();
        $gameTemp.clearActiveEvent();
        this.clearData(); // データの初期化
        this.setAllEventType(); // イベントタイプの設定
        this.setSrpgActors(); // アクターデータの作成
        this.setSrpgEnemys(); // エネミーデータの作成
        $gameMap.setEventImages();   // ユニットデータに合わせてイベントのグラフィックを変更する
        this.runBattleStartEvent(); // ゲーム開始時の自動イベントを実行する
        $gameVariables.setValue(_turnVarID, 1); // ターン数を初期化する
        $gameSystem.resetSearchedItemList(); // 探索済み座標を初期化する
        this.srpgStartActorTurn();// アクターターンを開始する
    };

    // イベントのメモからイベントのタイプを設定する
    Game_System.prototype.setAllEventType = function() {
        $gameMap.events().forEach(function(event) {
            if (event.event().meta.type) event.setType(event.event().meta.type);
        });
    }

    // イベントのメモからアクターを読み込み、対応するイベントIDに紐づけする
    Game_System.prototype.setSrpgActors = function() {
        var fix_actors = [];
        $gameVariables.setValue(_existActorVarID, 0);
        // 固定アクターを予約する
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'actor' && !event.isErased()) {
                var actorId = event.event().meta.id ? Number(event.event().meta.id) : 0;
                if (actorId > 0) {
                    fix_actors.push(actorId);
                }
            }
        });
        // アクターを読み込む
        var i = 0;
        // _srpgNotShowUpDeadActor === 'true'の場合は、戦闘不能のユニットを始めから戦闘メンバーに加えない。
        // これは戦闘不能になるとユニットがロスト（登場しなくなる）するようなゲームに向いている。
        if (_srpgNotShowUpDeadActor === 'false') var array = $gameParty.allMembers();
        else var array = $gameParty.allMembers().filter(function(actor){return actor.isAlive()});
        var actorNum = 0;
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'actor' && !event.isErased()) {
                // アクターの最大数が制限されている場合は、制限数以上のイベントを消去する
                if (_maxActorVarID > 0 && $gameVariables.value(_maxActorVarID) > 0 && 
                    actorNum >= $gameVariables.value(_maxActorVarID)) {
                    event.erase();
                    return;
                }
                // IDが0より大きい場合は指定したアクターIDで、0の場合はパーティメンバーの若い順にアクターを代入する
                var actorId = event.event().meta.id ? Number(event.event().meta.id) : 0;
                if (actorId > 0) {
                    var actor_unit = $gameActors.actor(actorId);
                } else {
                    for (var j=0; j < array.length; j++) {
                        var actor_unit = array[i];
                        if (!actor_unit) {
                            $gameSystem.setEventToUnit(event.eventId(), 'null', null);
                            break;
                        }
                        i += 1;
                        if (fix_actors.indexOf(actor_unit.actorId()) < 0) {
                            break;
                        }
                    };
                }
                // 有効なユニットの場合、初期化処理を行う
                if (actor_unit) {
                    $gameSystem.pushSrpgAllActors(event.eventId());
                    if (event.event().meta.mode) {
                        actor_unit.setBattleMode(event.event().meta.mode);
                        if (event.event().meta.targetId) {
                            actor_unit.setTargetId(Number(event.event().meta.targetId));
                        }
                    } else {
                        actor_unit.setBattleMode('normal');
                    }
                    actor_unit.setSearchItem(event.event().meta.searchItem);
                    actor_unit.initTp(); //TPを初期化
                    actor_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
                    // 参加するユニットが戦闘不能の場合、グラフィックを消去する。存在するアクター数も増やさない。
                    if (actor_unit.isDead() && !event.isErased()) {
                        event.erase();
                    } else {
                        var oldValue = $gameVariables.value(_existActorVarID);
                        $gameVariables.setValue(_existActorVarID, oldValue + 1);
                    }
                    actorNum += 1;
                    $gameSystem.setEventToUnit(event.eventId(), 'actor', actor_unit.actorId());
                }
            }
        });
    };

    // イベントのメモからエネミーを読み込み、対応するイベントIDに紐づけする
    Game_System.prototype.setSrpgEnemys = function() {
        $gameVariables.setValue(_existEnemyVarID, 0);
        var i = 0;
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'enemy' && !event.isErased()) {
                var enemyId = event.event().meta.id ? Number(event.event().meta.id) : 1;
                var enemy_unit = new Game_Enemy(enemyId, 0, 0);
                // 有効なユニットの場合、初期化処理を行う
                if (enemy_unit) {
                    if (event.event().meta.mode) {
                        enemy_unit.setBattleMode(event.event().meta.mode);
                        if (event.event().meta.targetId) {
                            enemy_unit.setTargetId(Number(event.event().meta.targetId));
                        }
                    } else {
                        enemy_unit.setBattleMode('normal');
                    }
                    enemy_unit.initTp(); //TPを初期化
                    enemy_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
                    var oldValue = $gameVariables.value(_existEnemyVarID);
                    $gameVariables.setValue(_existEnemyVarID, oldValue + 1);
                    $gameSystem.setEventToUnit(event.eventId(), 'enemy', enemy_unit);
                }
            }
        });
    };

    // 戦闘開始時のイベントを起動する
    Game_System.prototype.runBattleStartEvent = function() {
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'battleStart') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
            }
        });
    };

    //----------------------------------------------------------------
    // SRPG戦闘の終了に関係する処理
    //----------------------------------------------------------------
    // SRPG戦闘を終了する（プラグイン・コマンド）
    Game_System.prototype.endSRPG = function() {
        $gameTemp.clearActiveEvent(); // 行動中イベントの初期化
        // 全てのイベントのターン終了処理と（必要なら）回復
        $gameMap.events().forEach(function(event) {
            var battlerArray = $gameSystem.EventToUnit(event.eventId());
            if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
                if (_srpgBattleEndAllHeal === 'true') {
                    battlerArray[1].recoverAll();
                }
                battlerArray[1].onTurnEnd();
            }
        });
        this._SRPGMode = false; // SRPG戦闘中のフラグをオフにする
        $gameSwitches.setValue(_srpgBattleSwitchID, false); // スイッチにも代入する
        this._isBattlePhase = 'initialize';
        this._isSubBattlePhase = 'initialize';
        $gamePlayer.refresh();
        this.clearData(); // データの初期化
        $gameMap.setEventImages();   // イベントのグラフィックを本来のものに変更する
    };

    //----------------------------------------------------------------
    // SRPG戦闘の進行に関する変数や処理
    //----------------------------------------------------------------
    // 戦闘中かどうかのフラグを返す
    // SRPGギアでは、このフラグがtrueの場合をSRPG戦闘中と認識する
    Game_System.prototype.isSRPGMode = function() {
        return this._SRPGMode;
    };

    // 戦闘のフェーズを返す
    // これは戦闘の進行を管理する中心的なものとなる
    // initialize      ：初期化状態
    // actor_phase     ：アクター行動フェーズ
    // auto_actor_phase：アクター自動行動フェーズ
    // enemy_phase     ：エネミー行動フェーズ
    Game_System.prototype.isBattlePhase = function() {
        return this._isBattlePhase;
    };

    // 戦闘のフェーズを変更する
    Game_System.prototype.setBattlePhase = function(phase) {
        this._isBattlePhase = phase;
    };

    // 戦闘のサブフェーズを返す。
    // これは、各BattlePhase内で使用され、各段階での処理の進行を制御する。
    // initialize：初期化を行う状態
    // actor_phase内で使用
    //   normal：行動アクターが選択されていない状態（メニューを開くことが可能）
    //   actor_move：移動範囲が表示され、移動先を選択している状態
    //   actor_target：行動対象を選択している状態
    //   status_window：ステータスウィンドウが開かれている状態
    //   actor_command_window：アクターコマンドウィンドウが開かれている状態
    //   battle_window：攻撃確認ウィンドウが開かれている状態
    // auto_actor_phase内で使用
    //   auto_actor_command：自動行動アクターをイベント順に行動決定する状態
    //   auto_actor_move : 自動行動アクターが移動先を決定し、移動する状態
    //   auto_actor_action：自動行動アクターの実際の行動を行う状態
    // enemy_phase内で使用
    //   enemy_command：エネミーをイベント順に行動決定する状態
    //   enemy_move : エネミーが移動先を決定し、移動する状態
    //   enemy_action：エネミーの実際の行動を行う状態
    // いずれのBattlePhase内でも使用
    //   invoke_action：戦闘を実行している状態
    //   after_battle：戦闘終了後の処理を呼び出す状態
    Game_System.prototype.isSubBattlePhase = function() {
        return this._isSubBattlePhase;
    };

    // 戦闘のサブフェーズを変更する
    Game_System.prototype.setSubBattlePhase = function(phase) {
        this._isSubBattlePhase = phase;
    };

    // アクターターンの開始
    Game_System.prototype.srpgStartActorTurn = function() {
        this.aliveActorIdList = [];
        this.actorLRId = 0;
        $gameMap.events().forEach(function(event) {
            // アクターターン開始時のイベントがあれば、起動する
            if (event.isType() === 'actorTurn') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
            }
            // アクター・エネミーの場合、行動回数を設定する
            var battlerArray = $gameSystem.EventToUnit(event.eventId());
            if (battlerArray && battlerArray[0] === 'actor' && battlerArray[1].isAlive()) {
                $gameSystem.aliveActorIdList.push(event.eventId()); // 生存しているアクターの配列に加える
                battlerArray[1].SRPGActionTimesSet();
            }
            if (battlerArray && battlerArray[0] === 'enemy' && battlerArray[1].isAlive()) {
                battlerArray[1].SRPGActionTimesSet();
            }
        });
        // 生存しているアクターの中で、最も若いイベントIDのユニットにカーソルを合わせる
        this.aliveActorIdList.sort(function(a, b) {
            return a - b;
        });
        var actor1 = $gameMap.event(this.aliveActorIdList[0]);
        if (actor1) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination(actor1.posX(), actor1.posY());
        }
        this.setBattlePhase('actor_phase');
        this.setSubBattlePhase('initialize');
    };

    // 自動行動アクターターンの開始
    Game_System.prototype.srpgStartAutoActorTurn = function() {
        this.setBattlePhase('auto_actor_phase');
        this.setSubBattlePhase('auto_actor_command');
    };

    // エネミーターンの開始
    Game_System.prototype.srpgStartEnemyTurn = function() {
        $gameMap.events().forEach(function(event) {
            // エネミーターン開始時のイベントがあれば起動する
            if (event.isType() === 'enemyTurn') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
            }
        });
        this.setBattlePhase('enemy_phase');
        this.setSubBattlePhase('enemy_command');
    };

    // ターン終了
    Game_System.prototype.srpgTurnEnd = function() {
        $gameMap.events().forEach(function(event) {
            var battlerArray = $gameSystem.EventToUnit(event.eventId());
            if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
                battlerArray[1].onTurnEnd();
            }
        });
        // ターン終了時のイベントがあれば起動する
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'turnEnd') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
            }
        });
        this.srpgTurnPlus(); // ターンを加算する
        this.srpgStartActorTurn(); // アクターターンを開始する
    };

    // ターン数を増やす
    Game_System.prototype.srpgTurnPlus = function() {
        var oldValue = $gameVariables.value(_turnVarID);
        $gameVariables.setValue(_turnVarID, oldValue + 1);
    };

    //----------------------------------------------------------------
    // SRPG戦闘全体に関係する変数や処理
    //----------------------------------------------------------------
    //自動行動・エネミーの実行ＩＤを返す
    Game_System.prototype.isAutoUnitId = function() {
        return this._AutoUnitId;
    };

    //自動行動・エネミーの実行ＩＤを設定する
    Game_System.prototype.setAutoUnitId = function(num) {
        this._AutoUnitId = num;
    };

    // イベントIDに対応するアクター・エネミーデータをセットする
    Game_System.prototype.setEventToUnit = function(event_id, type, data) {
        this._EventToUnit[event_id] = [type, data];
    };

    // イベントIDから対応するアクター・エネミーデータを返す
    Game_System.prototype.EventToUnit = function(event_id) {
        var battlerArray = this._EventToUnit[event_id];
        if (battlerArray) {
            if (battlerArray[0] === 'actor') {
                var actor = $gameActors.actor(battlerArray[1]);
                return [battlerArray[0], actor]
            } else {
                return battlerArray;
            }
        } else {
            return;
        }
    };

    // アクターIDから対応するイベントIDを返す
    Game_System.prototype.ActorToEvent = function(actor_id) {
        var eventId = 0;
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'actor') {
                var actor = $gameSystem.EventToUnit(event.eventId())[1];
                if (actor && actor.actorId() === actor_id) {
                    eventId = event.eventId();
                }
            }
        });
        return eventId;
    };

    // 戦闘に参加するアクターのリストを返す
    // SRPG戦闘中は、パーティメンバー以外のアクターが戦闘に参加している場合があるため、
    // それを加えた全アクターの配列を用意する
    Game_System.prototype.srpgAllActors = function() {
        return this._srpgAllActors;
    };

    // 戦闘に参加するアクターをリストに加える
    Game_System.prototype.pushSrpgAllActors = function(eventId) {
        if (this._srpgAllActors.indexOf(eventId) < 0) {
            this._srpgAllActors.push(eventId);
            this._srpgAllActors.sort(function(a, b) {
                return a - b;
            });
        }
    };

    // 戦闘に参加するアクターのリストを初期化する
    Game_System.prototype.clearSrpgAllActors = function() {
        this._srpgAllActors = [];
    };

    // ユニット移動中のウェイトフラグを返す
    Game_System.prototype.srpgWaitMoving = function() {
        return this._SrpgWaitMoving;
    };

    // ユニット移動中のウェイトフラグを設定する
    Game_System.prototype.setSrpgWaitMoving = function(flag) {
        this._SrpgWaitMoving = flag;
    };

    // ２イベント間の距離を返す
    Game_System.prototype.unitDistance = function(event1, event2) {
        var minDisX = Math.abs(event1.posX() - event2.posX());
        var minDisY = Math.abs(event1.posY() - event2.posY());
        if ($gameMap.isLoopHorizontal() === true) {
            var event1X = event1.posX() > event2.posX() ? event1.posX() - $gameMap.width() : event1.posX() + $gameMap.width();
            var disX = Math.abs(event1X - event2.posX());
            minDisX = minDisX < disX ? minDisX : disX;
        }
        if ($gameMap.isLoopVertical() === true) {
            var event1Y = event1.posY() > event2.posY() ? event1.posY() - $gameMap.height() : event1.posY() + $gameMap.height();
            var disY = Math.abs(event1Y - event2.posY());
            minDisY = minDisY < disY ? minDisY : disY;
        }
        return minDisX + minDisY;
    };

    // 顔グラフィックのプリロード処理
    Game_System.prototype.preloadFaceGraphic = function(battlerArray) {
        // battlerArrayの指定がある場合は、それだけ処理する。無い場合は全てのイベントで処理する
        if (!battlerArray) {
            $gameMap.events().forEach(function(event) {
                var battlerArray = $gameSystem.EventToUnit(event.eventId());
                if (battlerArray && battlerArray[0] === 'actor') {
                    var bitmap = ImageManager.loadFace(battlerArray[1].faceName());
                } else if (battlerArray && battlerArray[0] === 'enemy') {
                    var faceName = battlerArray[1].enemy().meta.faceName;
                    if (faceName) {
                        var bitmap = ImageManager.loadFace(faceName);
                    } else {
                        if ($gameSystem.isSideView()) {
                            var bitmap = ImageManager.loadSvEnemy(battlerArray[1].battlerName());
                        } else {
                            var bitmap = ImageManager.loadEnemy(battlerArray[1].battlerName());
                        }
                    }
                }
            });
        } else {
            if (battlerArray && battlerArray[0] === 'actor') {
                var bitmap = ImageManager.loadFace(battlerArray[1].faceName());
            } else if (battlerArray && battlerArray[0] === 'enemy') {
                var faceName = battlerArray[1].enemy().meta.faceName;
                if (faceName) {
                    var bitmap = ImageManager.loadFace(faceName);
                } else {
                    if ($gameSystem.isSideView()) {
                        var bitmap = ImageManager.loadSvEnemy(battlerArray[1].battlerName());
                    } else {
                        var bitmap = ImageManager.loadEnemy(battlerArray[1].battlerName());
                    }
                }
            }
        }
    };

    // 戦闘シーン用のTroop, partyを作成する
    Game_System.prototype.setupSrpgPartyAndTroop = function(userArray, targetArray) {
        var user = userArray[1];
        var target = targetArray[1];
        $gameTroop.clearSrpgBattleEnemys();
        $gameTroop.clear();
        $gameParty.clearSrpgBattleActors();
        if (userArray[0] === 'enemy') {
            $gameTroop.pushSrpgBattleEnemys(user);
        } else { 
            $gameParty.pushSrpgBattleActors(user);
        }
        if (user !== target) {
            if (targetArray[0] === 'enemy') {
                $gameTroop.pushSrpgBattleEnemys(target);
            } else { 
                $gameParty.pushSrpgBattleActors(target);
            }
        }
        // BattleManagerを準備する
        if ($dataTroops[_srpgTroopID]) {
            BattleManager.setup(_srpgTroopID, false, true);
        } else {
            BattleManager.setup(1, false, true);
        }
    };

    // 戦闘シーンの準備を行う
    Game_System.prototype.setupSrpgBattleScene = function(userArray, targetArray) {
        var user = userArray[1];
        var target = targetArray[1];
        // party,troopの設定
        $gameSystem.setupSrpgPartyAndTroop(userArray, targetArray);
        // 共通する設定
        $gameTemp.setSrpgDistance($gameSystem.unitDistance($gameTemp.activeEvent(), $gameTemp.targetEvent()));
        // 攻撃側の設定
        var action = user.currentAction();
        user.setActionTiming(0);
        action.setSubject(user);
        if (action.isForFriend() && !action.isForUser()) action.setTarget(1);
        else action.setTarget(0);
        user.makeSrpgRangeListForBattle($gameTemp.activeEvent());
        // 防御側の設定
        if (user !== target) {
            target.setActionTiming(1);
            target.srpgMakeCounterActions(userArray, targetArray);
            target.makeSrpgRangeListForBattle($gameTemp.targetEvent());
        }
    };

    //----------------------------------------------------------------
    // 移動範囲の計算や表示に関する変数
    //----------------------------------------------------------------
    // 移動範囲を表示するスプライトの最大数
    Game_System.prototype.spriteMoveTileMax = function() {
        return Math.min($dataMap.width * $dataMap.height, 1000);
    };

    // 指定した座標が、探査済み座標のリストに含まれるか返す
    Game_System.prototype.indexOfSearchedItemList = function(xy) {
        if (!this._searchedItemList) {
            this._searchedItemList = [];
        }
        var flag = -1;
        for (var i=0; i < this._searchedItemList.length; i++) {
            var xy2 = this._searchedItemList[i];
            if (xy[0] === xy2[0] && xy[1] === xy2[1]) {
                flag = i;
                break;
            }
        };
        return flag;
    };

    // 探索済み座標のリストに座標を加える
    Game_System.prototype.pushSearchedItemList = function(xy) {
        if (!this._searchedItemList) {
            this._searchedItemList = [];
        }
        this._searchedItemList.push(xy);
    };

    // 探索済み座標のリストを初期化する
    Game_System.prototype.resetSearchedItemList = function() {
        this._searchedItemList = [];
    };

    // 移動範囲および攻撃範囲を計算・表示する
    Game_System.prototype.srpgMakeMoveTable = function(event) {
        // SRPG_RangeControl.jsで再定義する
    };

    // 移動先にアクターまたはエネミーがいる場合は移動できない（重なりを避ける）
    // 引数'type'は今は使用していないが、互換性維持のため残してある
    Game_System.prototype.areTheyNoUnits = function(x, y, type) {
        var flag = true;
        $gameMap.eventsXy(x, y).forEach(function(event) {
            var battlerArray = $gameSystem.EventToUnit(event.eventId());
            if (battlerArray && event !== $gameTemp.activeEvent() && !event.isErased() ||
                event.isType() === 'playerEvent') {
                flag = false;
            }
        });
        return flag;
    };

    // 移動先にイベントユニットがあるかどうか返す
    Game_System.prototype.isThereEventUnit = function(x, y) {
        var flag = false;
        $gameMap.eventsXy(x, y).forEach(function(event) {
            if (event.isType() === 'unitEvent') {
                flag = true;
            }
        });
        return flag;
    };

    // コマンドキャンセル時など、元の座標を中心に移動＋射程範囲を再表示する
	Game_System.prototype.srpgMakeMoveTableOriginalPos = function(event) {
		var user = $gameSystem.EventToUnit(event.eventId())[1];
		var item = null;
		if (user.action(0) && user.action(0).item()) item = user.action(0).item();
		else item = $dataSkills[user.attackSkillId()];

		$gameTemp.clearMoveTable();
		event.makeMoveTable($gameTemp.originalPos()[0], $gameTemp.originalPos()[1], user.srpgMove(), null, user.srpgThroughTag());
		if (item.meta.notUseAfterMove) { // cannot move before attacking
			var x = event.posX();
			var y = event.posY();
			event.makeRangeTable(x, y, user.srpgSkillRange(item), null, x, y, item);
		} else { // can move
			$gameTemp.moveList().forEach(function(pos) {
				var x = pos[0];
				var y = pos[1];
				var occupied = $gameMap.events().some(function(otherEvent) {
					if (otherEvent === event || otherEvent.isErased() || !otherEvent.pos(x, y)) return false;
					if (otherEvent.isType() === 'enemy') return true;
					if (otherEvent.isType() === 'actor') return true;
					if (otherEvent.isType() === 'playerEvent') return true;
				});
				if (!occupied) {
					event.makeRangeTable(x, y, user.srpgSkillRange(item), null, x, y, item);
				}
			});
		}
		$gameTemp.pushRangeListToMoveList();
	};

    //----------------------------------------------------------------
    // ウィンドウの表示や内容に関する変数
    //----------------------------------------------------------------
    // ステータスウィンドウのリフレッシュフラグを返す
    Game_System.prototype.srpgStatusWindowNeedRefresh = function() {
        return this._SrpgStatusWindowRefreshFlag;
    };

    // ステータスウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
    Game_System.prototype.setSrpgStatusWindowNeedRefresh = function(battlerArray) {
        this._SrpgStatusWindowRefreshFlag = [true, battlerArray];
    };

    // ステータスウィンドウのリフレッシュフラグをクリアする
    Game_System.prototype.clearSrpgStatusWindowNeedRefresh = function() {
        this._SrpgStatusWindowRefreshFlag = [false, null];
    };

    // 予想ウィンドウ・戦闘開始ウィンドウのリフレッシュフラグを返す
    Game_System.prototype.srpgBattleWindowNeedRefresh = function() {
        return this._SrpgBattleWindowRefreshFlag;
    };

    // 予想ウィンドウ・戦闘開始ウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
    Game_System.prototype.setSrpgBattleWindowNeedRefresh = function(actionBattlerArray, targetBattlerArray) {
        this._SrpgBattleWindowRefreshFlag = [true, actionBattlerArray, targetBattlerArray];
    };

    // 予想ウィンドウ・戦闘開始ウィンドウのリフレッシュフラグをクリアする
    Game_System.prototype.clearSrpgBattleWindowNeedRefresh = function() {
        this._SrpgBattleWindowRefreshFlag = [false, null, null];
    };

   // アクターコマンドウィンドウのリフレッシュフラグを返す
    Game_System.prototype.srpgActorCommandWindowNeedRefresh = function() {
        return this._SrpgActorCommandWindowRefreshFlag;
    };

    // アクターコマンドウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
    Game_System.prototype.setSrpgActorCommandWindowNeedRefresh = function(battlerArray) {
        this._SrpgActorCommandWindowRefreshFlag = [true, battlerArray];
    };

    // アクターコマンドウィンドウのリフレッシュフラグをクリアする
    Game_System.prototype.clearSrpgActorCommandWindowNeedRefresh = function() {
        this._SrpgActorCommandWindowRefreshFlag = [false, null];
    };

    // 行動中アクターの簡易ステータスウィンドウのリフレッシュフラグを返す
    Game_System.prototype.srpgActorCommandStatusWindowNeedRefresh = function() {
        return this._SrpgActorCommandStatusWindowRefreshFlag;
    };

    // 行動中アクターの簡易ステータスウィンドウのリフレッシュフラグを設定する（同時にユニットの情報を保持する）
    Game_System.prototype.setSrpgActorCommandStatusWindowNeedRefresh = function(battlerArray) {
        this._SrpgActorCommandStatusWindowRefreshFlag = [true, battlerArray];
    };

    // 行動中アクターの簡易ステータスウィンドウのリフレッシュフラグをクリアする
    Game_System.prototype.clearSrpgActorCommandStatusWindowNeedRefresh = function() {
        this._SrpgActorCommandStatusWindowRefreshFlag = [false, null];
    };

    // 勝利・敗北条件ウィンドウの内容を返す
    Game_System.prototype.srpgWinLoseCondition = function() {
        return this._SrpgWinLoseCondition;
    };

    // 勝利条件の内容を設定する
    Game_System.prototype.setSrpgWinCondition = function(text) {
        this._SrpgWinLoseCondition.push(['win', text]);
    };

    // 敗北条件の内容を設定する
    Game_System.prototype.setSrpgLoseCondition = function(text) {
        this._SrpgWinLoseCondition.push(['lose', text]);
    };

    // 勝利・敗北条件ウィンドウの内容をクリアする
    Game_System.prototype.clearSrpgWinLoseCondition = function() {
        this._SrpgWinLoseCondition = [];
    };

    //----------------------------------------------------------------
    // プレイヤーによる操作に関する処理
    //----------------------------------------------------------------
    // 次のカーソル移動先のアクターを取得する(R)
    Game_System.prototype.getNextRActor = function() {
        for (var i = 0; i < this.aliveActorIdList.length; i++) {
            this.actorLRId += 1;
            if (this.actorLRId >= this.aliveActorIdList.length) this.actorLRId = 0;
            var battlerArray = $gameSystem.EventToUnit(this.aliveActorIdList[this.actorLRId]);
            if (battlerArray && battlerArray[0] === 'actor' && battlerArray[1].isAlive()) {
                break;
            }
        }
        var actor1 = $gameMap.event(this.aliveActorIdList[this.actorLRId]);
        if (actor1) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination(actor1.posX(), actor1.posY());
        }
    }

    // 次のカーソル移動先のアクターを取得する(L)
    Game_System.prototype.getNextLActor = function() {
        for (var i = 0; i < this.aliveActorIdList.length; i++) {
            this.actorLRId -= 1;
            if (this.actorLRId < 0) this.actorLRId = this.aliveActorIdList.length - 1;
            var battlerArray = $gameSystem.EventToUnit(this.aliveActorIdList[this.actorLRId]);
            if (battlerArray && battlerArray[0] === 'actor' && battlerArray[1].isAlive()) {
                break;
            }
        }
        var actor1 = $gameMap.event(this.aliveActorIdList[this.actorLRId]);
        if (actor1) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination(actor1.posX(), actor1.posY());
        }
    }

//==================================================================
// ●Game_Action
//==================================================================
    //----------------------------------------------------------------
    // 行動の試行
    // map battleでは$gameParty.inBattleがfalseのため変更してある
    //----------------------------------------------------------------
    const _SRPG_AAP_Game_Action_testApply = Game_Action.prototype.testApply;
    Game_Action.prototype.testApply = function(target) {
        if ($gameSystem.isSRPGMode() === true) {
            return (
                this.testLifeAndDeath(target) &&
                ($gameParty.inBattle() || 
                 $gameSystem.isSubBattlePhase() === 'invoke_action' ||
                    (this.isHpRecover() && target.hp < target.mhp) ||
                    (this.isMpRecover() && target.mp < target.mmp) ||
                    this.hasItemAnyValidEffects(target))
            );
        } else {
            return _SRPG_AAP_Game_Action_testApply.call(this, target);
        }
    };

    //----------------------------------------------------------------
    // 行動速度
    //----------------------------------------------------------------
    // 行動順を敏捷順で決定する。乱数を廃止し、agiの値を基本とする。
    // そこに、_srpgBattleOrder === 1で攻撃側が先攻の設定になっている場合、攻撃側に速度補正+1000する。
    // 速度補正・攻撃速度補正も行う（これにより、攻撃側が先攻でも「防御」は先に発動する、といった演出が可能）
    const _SRPG_AAP_Game_Action_speed = Game_Action.prototype.speed;
    Game_Action.prototype.speed = function() {
        if ($gameSystem.isSRPGMode() === true) {
            var speed = this.subject().agi;
            if (this.item()) speed += this.item().speed;
            if (this.isAttack()) speed += this.subject().attackSpeed();
            if (_srpgBattleOrder === 1 && this.subject().srpgActionTiming() === 0) speed += 1000;
            return speed;
        } else {
            return _SRPG_AAP_Game_Action_speed.call(this);
        }
    };

    //----------------------------------------------------------------
    // PredictionWindowに関する処理
    //----------------------------------------------------------------
    // 予想ダメージの計算
    Game_Action.prototype.srpgPredictionDamage = function(target) {
        var item = this.item();
        if (this.item().damage.type > 0) {
            var baseValue = this.evalDamageFormula(target);
        } else {
            var baseValue = 0;
        }
        var value = baseValue * this.calcElementRate(target);
        if (this.isPhysical()) value *= target.pdr;
        if (this.isMagical()) value *= target.mdr;
        if (baseValue < 0) value *= target.rec;
        item.effects.forEach(function(effect) {
            value -= this.srpgPredictionItemEffect(target, effect);
        }, this);
        return Math.round(value);
    };

    // 予想ダメージ計算におけるアイテムエフェクトの計算
    Game_Action.prototype.srpgPredictionItemEffect = function(target, effect) {
        switch (effect.code) {
        case Game_Action.EFFECT_RECOVER_HP:
            var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
            if (this.isItem()) value *= this.subject().pha;
            return Math.floor(value);
        case Game_Action.EFFECT_RECOVER_MP:
            var value = (target.mmp * effect.value1 + effect.value2) * target.rec;
            if (this.isItem()) value *= this.subject().pha;
            return Math.floor(value);
        case Game_Action.EFFECT_GAIN_TP:
            var value = Math.floor(effect.value1);
            return Math.floor(value);
        }
        return 0;
    };

    //----------------------------------------------------------------
    // 自動行動アクター・エネミーの行動に関する処理
    //----------------------------------------------------------------
    // エネミーアクションのインデックスを設定する
    Game_Action.prototype.setSrpgEnemySubject = function(index) {
        this._subjectEnemyIndex = index;
        this._subjectActorId = 0;
    };

    // 混乱状態でのターゲットを設定する
    var _SRPG_Game_Action_confusionTarget = Game_Action.prototype.confusionTarget;
    Game_Action.prototype.confusionTarget = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if (this._targetIndex === 0) {
                 return this.opponentsUnit().smoothTarget(this._targetIndex);
            } else {
                 return this.friendsUnit().smoothTarget(this._targetIndex);
            }
        } else {
            _SRPG_Game_Action_confusionTarget.call(this);
        }
    };

//==================================================================
// ●Game_BattlerBase
//====================================================================
    //----------------------------------------------------------------
    // 初期処理
    //----------------------------------------------------------------
    var _SRPG_Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _SRPG_Game_BattlerBase_initMembers.call(this);
        this._srpgTurnEnd = false;
        this._srpgActionTiming = -1; // 0:攻撃側、1:防御側
        this._srpgRangeListForBattle = [];
    };

    //----------------------------------------------------------------
    // バトラーのSRPG戦闘中のパラメータ・変数
    //----------------------------------------------------------------
    // 移動力を返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgMove = function() {
        return 0;
    };

    // スキル・アイテムの射程を返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgSkillRange = function(skill) {
        return 0;
    };

    // 武器の攻撃射程を返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgWeaponRange = function() {
        return 0;
    };

    // 武器の最低射程を返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgWeaponMinRange = function() {
        return 0;
    };

    // 武器の特殊射程の形状を返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgWeaponSpecialRange = function() {
        return 'normal'; // 便宜上 normal としている
    };

    // 通行可能タグを返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgThroughTag = function() {
        return 0;
    };

    // 行動終了かどうかを返す
    Game_BattlerBase.prototype.srpgTurnEnd = function() {
        return this._srpgTurnEnd;
    };

    // 行動終了を設定する
    Game_BattlerBase.prototype.setSrpgTurnEnd = function(flag) {
        this._srpgTurnEnd = flag;
    };

    // 攻撃側か防御側かを返す
    Game_BattlerBase.prototype.srpgActionTiming = function() {
        return this._srpgActionTiming;
    };

    // 攻撃側か防御側かを設定する
    Game_BattlerBase.prototype.setActionTiming = function(timing) {
        this._srpgActionTiming = timing;
    };

    // 戦闘用のrangeListを返す
    Game_BattlerBase.prototype.srpgRangeListForBattle = function() {
        return this._srpgRangeListForBattle;
    };

    // 戦闘用のrangeListを追加する
    Game_BattlerBase.prototype.pushSrpgRangeListForBattle = function(x, y) {
        this._srpgRangeListForBattle.push([x, y]);
    };

    // 戦闘用のrangeListを初期化する
    Game_BattlerBase.prototype.clearSrpgRangeListForBattle = function() {
        this._srpgRangeListForBattle = [];
    };

    // 応戦に使用するスキルのリストを返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgReactionSkill = function() {
        return [];
    };

    // 代替スキルのIDを返す（定義は、gameActor, gameEnemyで行う）
    Game_BattlerBase.prototype.srpgAlternativeSkillId = function() {
        return 1;
    };

    // 戦闘用の射程計算（canUseでの使用を想定）
    Game_BattlerBase.prototype.makeSrpgRangeListForBattle = function(event) {
		if (!event || !this.currentAction() || !this.currentAction().item()) return;
        var skill = this.currentAction().item();
		var x = event.posX();
        var y = event.posY();
        var range = this.srpgSkillRange(skill);
        this.clearSrpgRangeListForBattle();
		var minRange = this.srpgSkillMinRange(skill);

        // all actor or enemy
		if (skill.meta.specialRange === 'allActor' || skill.meta.specialRange === 'allEnemy') {
            var battler = $gameSystem.EventToUnit(event.eventId())[1];
			this.makeAllRangeListForBattle(skill, battler);
			return;
		}

        // normal range
		var edges = [];
		if (range > 0) edges = [[x, y, range, [0], []]];
		if (minRange <= 0) this.pushSrpgRangeListForBattle(x, y);
		$gameMap.makeSrpgLoSTable(event);

		for (var i = 0; i < edges.length; i++) {
			var cell = edges[i];
			var drange = cell[2] - 1;
			for (var d = 2; d < 10; d += 2) {
				if (cell[4][d] == 1) continue;
				if (!event.srpgRangeCanPass(cell[0], cell[1], d)) continue;

				var dx = $gameMap.roundXWithDirection(cell[0], d);
				var dy = $gameMap.roundYWithDirection(cell[1], d);
				var route = cell[3].concat(d);
				var forward = cell[4].slice(0);
				forward[10-d] = 1;
				if (drange > 0) edges.push([dx, dy, drange, route, forward]);

				if ($gameMap.distTo(x, y, dx, dy) >= minRange && event.srpgRangeExtention(dx, dy, x, y, skill, range)) {
					if (this.srpgRangeListForBattle().indexOf([dx, dy]) < 0) {
						this.pushSrpgRangeListForBattle(dx, dy);
					}
				}
			}
		}
	};

    // 戦闘用の全体射程の射程範囲を作成する
	Game_BattlerBase.prototype.makeAllRangeListForBattle = function(skill, battler) {
		$gameMap.events().forEach(function(event) {
            if ((skill.meta.specialRange === 'allActor' && 
				 event.isType() === 'actor' && !event.isErased()) ||
				(skill.meta.specialRange === 'allEnemy' && 
				 event.isType() === 'enemy' && !event.isErased()) ) {
				var dx = event.posX();
				var dy = event.posY();
				if (battler.srpgRangeListForBattle().indexOf([dx, dy]) < 0) {
                    battler.pushSrpgRangeListForBattle(dx, dy);
                }
            }
        });
	}

    //----------------------------------------------------------------
    // ユニットの状態やスキル・アイテムの使用に関する判定処理
    //----------------------------------------------------------------
    // 入力可能かどうかの判定
    var _SRPG_Game_BattlerBase_canInput = Game_BattlerBase.prototype.canInput;
    Game_BattlerBase.prototype.canInput = function() {
        if ($gameSystem.isSRPGMode() === true) {
            return this.isAppeared() && !this.isRestricted() && !this.isAutoBattle() &&
                   !this.srpgTurnEnd();
        } else {
            return _SRPG_Game_BattlerBase_canInput.call(this);
        }
    };

    // スキル・アイテムが使用可能な状況かの判定
    var _SRPG_Game_BattlerBase_isOccasionOk = Game_BattlerBase.prototype.isOccasionOk;
    Game_BattlerBase.prototype.isOccasionOk = function(item) {
        if ($gameSystem.isSRPGMode() === true) {
            if ($gameSystem.isBattlePhase() === 'actor_phase' &&
                $gameSystem.isSubBattlePhase() === 'normal') {
                return false;
            } else {
                return item.occasion === 0 || item.occasion === 1;
            }
        } else {
            return _SRPG_Game_BattlerBase_isOccasionOk.call(this, item);
        }
    };

    // スキル・アイテムが使用可能かの判定
    var _SRPG_Game_BattlerBase_canUse = Game_BattlerBase.prototype.canUse;
    Game_BattlerBase.prototype.canUse = function(item) {
        if ($gameSystem.isSRPGMode() === true) {
            if (!item) return false;
            // メニュー画面からスキル・アイテムが使えないようにする
            if ($gameSystem.isBattlePhase() === 'actor_phase' && 
                $gameSystem.isSubBattlePhase() === 'normal') {
                return false;
            }
            // 移動後使用不可のスキルは、歩数が0より大きい場合使えない
            if ($gameSystem.isSubBattlePhase() === 'actor_command_window' &&
                item.meta.notUseAfterMove && this.movedStep() !== 0) {
                return false;
            }
            // 戦闘シーン、自動アクター・エネミーの行動中、戦闘開始画面では
            if ($gameSystem.isSubBattlePhase() === 'invoke_action' ||
                 $gameSystem.isSubBattlePhase() === 'auto_actor_action' ||
                 $gameSystem.isSubBattlePhase() === 'enemy_action' ||
                 $gameSystem.isSubBattlePhase() === 'battle_window') {
                // <cellTarget>のスキルは、戦闘開始ウィンドウを開く時点で判定が終わっているため
                // trueを返す（スキルの範囲は「なし」を想定）
                if (item.meta.cellTarget) return true;
                // 戦闘不能回復スキルは使用できる
                if (item.scope === 9 || item.scope === 10) return true;
                // 射程外、特殊射程外、移動後使用不可の場合は使えない
                if (this.isTargetInRange(item) === false ||
                    (item.meta.notUseAfterMove && this.movedStep() !== 0) ) {
                    return false;
                }            
            }
        }
        return _SRPG_Game_BattlerBase_canUse.call(this, item);
    };

    // 対象のイベントが射程範囲内にいるかの判定
    Game_BattlerBase.prototype.isTargetInRange = function(item) {
        var targetEvent = (this._srpgActionTiming === 1) ? $gameTemp.activeEvent() : $gameTemp.targetEvent();
        if (!targetEvent) return false;
        if (item.scope === 11) return true;
        for (var i = 0; i < this.srpgRangeListForBattle().length; i++) {
            var xy = this.srpgRangeListForBattle()[i];
            if (xy[0] === targetEvent.posX() && xy[1] === targetEvent.posY()) return true;
        }
        return false;
    };

    //----------------------------------------------------------------
    // ターン経過処理
    //----------------------------------------------------------------
    // ステートのターン経過処理（ＳＲＰＧ用）
    // 行動終了時：行動ごとに１ターン経過
    // ターン終了時：全体のターン終了ごとに１ターン経過
    // 戦闘終了時：SRPG戦闘の終了時
    Game_BattlerBase.prototype.updateSrpgStateTurns = function(timing) {
        this._states.forEach(function(stateId) {
            if (this._stateTurns[stateId] > 0 && $dataStates[stateId].autoRemovalTiming === timing) {
                this._stateTurns[stateId]--;
            }
        }, this);
    };

//====================================================================
// ●Game_Battler
//====================================================================
    //----------------------------------------------------------------
    // 初期処理
    //----------------------------------------------------------------
    var _SRPG_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        _SRPG_Game_Battler_initMembers.call(this);
        this._battleMode = 'normal';
        this._eventId = 0;
        this._searchItem = false;
        this._targetId = -1;
        this._SRPGActionTimes = 1;
        this._usedFirstSkill = false;
        this._movedStep = 0;
        this._shouldPaySkillCost = true;
        this._usedSkill = [];
    };

    //----------------------------------------------------------------
    // SRPG戦闘中のバトラーのパラメータや状態
    //----------------------------------------------------------------
    // 行動モードを返す
    Game_Battler.prototype.battleMode = function() {
        return this._battleMode;
    };

    // 行動モードを設定する
    Game_Battler.prototype.setBattleMode = function(mode) {
        this._battleMode = mode;
    };

    // イベントIDを返す
    Game_Battler.prototype.srpgEventId = function() {
        return this._eventId;
    };

    // イベントIDを設定する（紐づけする）
    Game_Battler.prototype.setSrpgEventId = function(id) {
        this._eventId = id;
    };

    // アイテム探査モードを返す
    Game_Battler.prototype.searchItem = function() {
        return this._searchItem;
    };

    // アイテム探査モードを設定する
    Game_Battler.prototype.setSearchItem = function(mode) {
        if (mode) {
            this._searchItem = true;
        } else {
            this._searchItem = false;
        }
    };

    // ターゲットIDを返す
    Game_Battler.prototype.targetId = function() {
        return this._targetId;
    };

    // ターゲットIDを設定する
    Game_Battler.prototype.setTargetId = function(id) {
        this._targetId = id;
    };

    // 行動回数を返す
    Game_Battler.prototype.SRPGActionTimes = function() {
        return this._SRPGActionTimes;
    };

    // 行動回数を設定する（SRPG用）
    Game_Battler.prototype.SRPGActionTimesSet = function() {
        this._SRPGActionTimes = _SRPG_Game_Battler_makeActionTimes.call(this);
    };

    // 行動回数を追加する（SRPG用）
    Game_Battler.prototype.SRPGActionTimesAdd = function(num) {
        this._SRPGActionTimes += num;
    };

    // 行動回数を消費する
    Game_Battler.prototype.useSRPGActionTimes = function(num) {
        this._SRPGActionTimes -= num;
    };

    // 移動した歩数を返す
    Game_Battler.prototype.movedStep = function() {
        return this._movedStep;
    };

    // 移動した歩数を設定する
    Game_Battler.prototype.setMovedStep = function(num) {
        this._movedStep = num;
    };

    // 装備が有効か返す（hasNoWeaponsの判定）
    Game_Battler.prototype.isEquipValid = function(item) {
        if (!item) return false;
        if (DataManager.isItem(item)) return true;
        if (DataManager.isArmor(item)) return true;
        if (DataManager.isWeapon(item) && !this.hasNoWeapons()) return true;
        return false;
    };

    // 行動回数の設定（戦闘シーン用）
    var _SRPG_Game_Battler_makeActionTimes = Game_Battler.prototype.makeActionTimes;
    Game_Battler.prototype.makeActionTimes = function() {
        if ($gameSystem.isSRPGMode() === true) {
            return 1;
        } else {
            return _SRPG_Game_Battler_makeActionTimes.call(this);
        }
    };

    // アクションの空配列を作成する（戦闘シーン用）
    Game_Battler.prototype.srpgMakeNewActions = function() {
        this.clearActions();
        var actionTimes = this.makeActionTimes();
        this._actions = [];
        for (var i = 0; i < actionTimes; i++) {
            this._actions.push(new Game_Action(this));
        }
        this.setActionState('waiting');
    };

    // 応戦の行動の設定（自身がtargetとなっている, 自分自身が対象の行動では設定しない）
    Game_Battler.prototype.srpgMakeCounterActions = function(userArray, targetArray) {
        targetArray[1].clearActions();
        targetArray[1].clearSrpgRangeListForBattle();
        if (_srpgBattleReaction === 3) return;
        if (_srpgBattleReaction === 2 && targetArray[1].cnt === 0) return;
        if (userArray[0] !== targetArray[0] && userArray[1].currentAction().item().meta.srpgUncounterable) return;
        if (!targetArray[1].canMove()) return;
        // 応戦するスキルを設定する
        var skillList = targetArray[1].srpgReactionSkill();
        for (var i = 0; i < skillList.length; i++) {
            // actionの作成
            targetArray[1].srpgMakeNewActions();
            var reaction = targetArray[1].action(0);
            // actionを設定する
            if (skillList[i] === 0) break;
            else if (skillList[i] === 1) reaction.setAttack();
            else reaction.setSkill(skillList[i]);
            // actionが有効か判定する
            if (reaction.item()) {
                targetArray[1].makeSrpgRangeListForBattle($gameTemp.targetEvent());
                // skillを使用できる場合はbreak
                if ((reaction.isForUser() ||
                    (reaction.isForFriend() && userArray[0] === targetArray[0]) ||
                    (reaction.isForOpponent() && userArray[0] !== targetArray[0])) &&
                    targetArray[1].canUse(reaction.item())) {
                    break;
                } else {
                    reaction.setSkill(0);
                }
            }
        }
        if (reaction && reaction.item()) {
            // subjectの設定
            if (targetArray[0] === 'enemy') {
                if (userArray[0] !== targetArray[0]) reaction.setSrpgEnemySubject(0);
                else reaction.setSrpgEnemySubject(1);
            } else {
                reaction.setSubject(targetArray[1]);
            }
            // reactionのtargetを設定する
            if (reaction.isForUser()) reaction.setTarget(1);
            else reaction.setTarget(0);
        } else {
            // 行動できない場合は、actionをクリアする
            targetArray[1].clearActions();
            targetArray[1].clearSrpgRangeListForBattle();
        }
    };

    // ターン内で一度使ったスキルかを返す(自動行動アクター、エネミー用)
    Game_Battler.prototype.usedSkill = function() {
        return this._usedSkill;
    };

    // ターン内で一度使ったスキルかを設定する
    Game_Battler.prototype.setUsedSkill = function(id) {
        this._usedSkill.push(id);
    };

    // ターン内で一度使ったスキルかをクリアする
    Game_Battler.prototype.clearUsedSkill = function() {
        this._usedSkill = [];
    };

    // 自動行動アクター、エネミーの使用禁止フラグを返す
    Game_Battler.prototype.isAIDoNotUse = function(item) {
        if (item.meta.simpleAI === 'notUse') return true;
        if (item.meta.simpleAI === 'oneTime' && this._usedSkill.indexOf(item.id) >= 0) return true;
        return false;
    };

    //----------------------------------------------------------------
    // 各状態での処理
    //----------------------------------------------------------------
    // 戦闘シーン開始時の処理
    var _SRPG_Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this.setActionState('undecided');
            this.clearMotion();
            this._usedFirstSkill = false;
        } else {
            return _SRPG_Game_Battler_onBattleStart.call(this);
        }
    };

    // 戦闘シーン終了時の処理
    var _SRPG_Game_Battler_onAllActionsEnd = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this.updateSrpgStateTurns(1);
            this.removeStatesAuto(1);
            this.setMovedStep(0);
            this.clearResult();
        } else {
            return _SRPG_Game_Battler_onAllActionsEnd.call(this);
        }
    };

    // 全体のターン終了時の処理
    var _SRPG_Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this.regenerateAll();
            this.updateSrpgStateTurns(2);
            this.updateBuffTurns();
            this.removeStatesAuto(2);
            this.removeBuffsAuto();
            this.clearResult();
            this.setSrpgTurnEnd(false);
        } else {
            return _SRPG_Game_Battler_onTurnEnd.call(this);
        }
    };

    //----------------------------------------------------------------
    // 敏捷差による２回行動に関する処理
    //----------------------------------------------------------------
    // １回目の行動を保存しておく
    var _SRPG_AAP_Game_Battler_initMembers = Game_Battler.prototype.initMembers;
    Game_Battler.prototype.initMembers = function() {
        _SRPG_AAP_Game_Battler_initMembers.call(this);
        this._reserveAction = null;
    };

    Game_Battler.prototype.reserveSameAction = function() {
        this._reserveAction = this._actions[0];
    };

    // １回目の行動を追加する
    Game_Battler.prototype.addSameAction = function(agilityRate) {
        if (!this.currentAction() && this._reserveAction) {
            if (agilityRate > Math.randomInt(100)) {
                this._actions = this._actions.concat(this._reserveAction);
                var targets = this._actions[0].makeTargets();
                if (targets.length === 0) {
                    this._actions = [];
                }
            }
            this._reserveAction = null;
        }
    };

    // フラグがONの場合、敏捷差による２回目の行動時にはコストを消費しない
    var _SRPG_AAP_Game_Battler_useItem = Game_Battler.prototype.useItem;
    Game_Battler.prototype.useItem = function(item) {
        if ($gameSystem.isSRPGMode() === true) {
            if (DataManager.isSkill(item)) {
                if (!this._usedFirstSkill ||
                    (_srpgAgiAttackPlusPayCost === 2 || _srpgAgiAttackPlusPayCost === 4)) {
                    this.paySkillCost(item);
                    this._usedFirstSkill = true;
                }
            } else if (DataManager.isItem(item)) {
                if (!this._usedFirstSkill || 
                    (_srpgAgiAttackPlusPayCost === 3 || _srpgAgiAttackPlusPayCost === 4)) {
                    this.consumeItem(item);
                    this._usedFirstSkill = true;
                }
            }
        } else {
            return _SRPG_AAP_Game_Battler_useItem.call(this, item);
        }
    };

    //----------------------------------------------------------------
    // 床ダメージに関する処理
    //----------------------------------------------------------------
    // ダメージ床の上にいるかの判定
    Game_Battler.prototype.srpgCheckFloorEffect = function(x, y) {
        if ($gameMap.isDamageFloor(x, y) === true) {
            this.srpgExecuteFloorDamage();
        }
    };

    // ダメージ床の処理
    Game_Battler.prototype.srpgExecuteFloorDamage = function() {
        var damage = Math.floor(this.srpgBasicFloorDamage() * this.fdr);
        damage = Math.min(damage, this.srpgMaxFloorDamage());
        this.gainHp(-damage);
        if (damage > 0) $gameScreen.startFlashForDamage();
    };

    // ダメージ床で受けるダメージ量を返す
    Game_Battler.prototype.srpgBasicFloorDamage = function() {
        return this.mhp * 0.1;
    };

    // 床ダメージの最大値を設定する
    Game_Battler.prototype.srpgMaxFloorDamage = function() {
        return $dataSystem.optFloorDeath ? this.hp : Math.max(this.hp - 1, 0);
    };

//====================================================================
// ●Game_Actor
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘に関するパラメータ
    //----------------------------------------------------------------
    // 特徴を返す
    var _SRPG_Game_Actor_traitObjects = Game_Actor.prototype.traitObjects;
    Game_Actor.prototype.traitObjects = function() {
        if ($gameSystem.isSRPGMode() === true) {
            var objects = Game_Battler.prototype.traitObjects.call(this);
            objects = objects.concat([this.actor(), this.currentClass()]);
            var equips = this.equips();
            for (var i = 0; i < equips.length; i++) {
                var item = equips[i];
                if (this.isEquipValid(item)) objects.push(item);
            }
            return objects;
        } else {
            return _SRPG_Game_Actor_traitObjects.call(this);
        }
    };

    // 装備による能力値を返す
    var _SRPG_Game_Actor_paramPlus = Game_Actor.prototype.paramPlus;
    Game_Actor.prototype.paramPlus = function(paramId) {
        if ($gameSystem.isSRPGMode() === true) {
            var value = Game_Battler.prototype.paramPlus.call(this, paramId);
            var equips = this.equips();
            for (var i = 0; i < equips.length; i++) {
                var item = equips[i];
                if (this.isEquipValid(item)) value += item.params[paramId];
            }
            return value;
        } else {
            return _SRPG_Game_Actor_paramPlus.call(this, paramId);
        }
    };

    // 移動力を返す
    Game_Actor.prototype.srpgMove = function() {
        // SRPG_RangeControl.jsで再定義する
    };

    // スキル・アイテムの射程を返す
    Game_Actor.prototype.srpgSkillRange = function(skill) {
        // SRPG_RangeControl.jsで再定義する
    };

    // スキル・アイテムの最低射程を返す
    Game_Actor.prototype.srpgSkillMinRange = function(skill) {
        // SRPG_RangeControl.jsで再定義する
    };

    // 武器の攻撃射程を返す
    Game_Actor.prototype.srpgWeaponRange = function() {
        return this.srpgSkillRange($dataSkills[this.attackSkillId()]);
    };

    // 武器の最低射程を返す
    Game_Actor.prototype.srpgWeaponMinRange = function() {
        return this.srpgSkillMinRange($dataSkills[this.attackSkillId()]);
    };

    // 武器の特殊射程の形状を返す
    Game_Actor.prototype.srpgWeaponSpecialRange = function() {
        var value = Game_BattlerBase.prototype.srpgWeaponSpecialRange.call(this);
        if (!this.hasNoWeapons()) {
            var weapon = this.weapons()[0];
            if (weapon.meta.specialRange) value = weapon.meta.specialRange;
        } else if (this.currentClass().meta.specialRange) {
            value = this.currentClass().meta.specialRange;
        } else if (this.actor().meta.specialRange) {
            value = this.actor().meta.specialRange;
        }
        return value;
    };

    // 武器を装備しているか返す
    var _SRPG_Game_Actor_hasNoWeapons = Game_Actor.prototype.hasNoWeapons;
    Game_Actor.prototype.hasNoWeapons = function() {
        if ($gameSystem.isSRPGMode() === true) {
            var flag = this.weapons().length === 0;
            this.states().forEach(function(state) {
                if (state && state.meta.srpgWeaponBreak) flag = true;
            }, this);
            return flag;
        } else {
            return _SRPG_Game_Actor_hasNoWeapons.call(this);
        }
    };
    
    // attackSkillId == 1 以外の武器を作る
    Game_Actor.prototype.attackSkillId = function() {
        // プラグインのデフォルト
        var value = Game_BattlerBase.prototype.attackSkillId.call(this);
        // アクター
        if (this.actor().meta.srpgWeaponSkill) value = Number(this.actor().meta.srpgWeaponSkill);
        // 職業
        if (this.currentClass().meta.srpgWeaponSkill) value = Number(this.currentClass().meta.srpgWeaponSkill);
        // スキル
        this.skills().forEach(function(skill) {
			if (skill && skill.meta.srpgWeaponSkill) value = Number(skill.meta.srpgWeaponSkill);
		}, this);
        // 装備
        this.equips().forEach(function(item) {
            if (this.isEquipValid(item) && item.meta.srpgWeaponSkill) {
                value = Number(item.meta.srpgWeaponSkill);
            }
        }, this);
        // ステート
        this.states().forEach(function(state) {
            if (state && state.meta.srpgWeaponSkill) value = Number(state.meta.srpgWeaponSkill);
        }, this);
        return value;
    };

    // 応戦に使用するスキルのリストを返す
    // ＊<srpgCounter:false>は、互換性のために残してある。ID 0 と同様に処理する。
    Game_Actor.prototype.srpgReactionSkill = function() {
        var array = [];
        // プラグインのデフォルト
        array.unshift(_srpgDefaultReactionSkill);
        // アクター
        if (this.actor().meta.srpgReactionSkill) array.unshift(Number(this.actor().meta.srpgReactionSkill));
        if (this.actor().meta.srpgCounter === 'false') array.unshift(0);
        // 職業
        if (this.currentClass().meta.srpgReactionSkill) array.unshift(Number(this.currentClass().meta.srpgReactionSkill));
        if (this.currentClass().meta.srpgCounter === 'false') array.unshift(0);
		// スキル
        this.skills().forEach(function(skill) {
			if (skill) {
                if (skill.meta.srpgReactionSkill) array.unshift(Number(skill.meta.srpgReactionSkill));
                if (skill.meta.srpgCounter === 'false') array.unshift(0);
			}
		}, this);
        // 装備
        this.equips().forEach(function(item) {
			if (this.isEquipValid(item)) {
                if (item.meta.srpgReactionSkill) array.unshift(Number(item.meta.srpgReactionSkill));
                if (item.meta.srpgCounter === 'false') array.unshift(0);
			}
		}, this);
		// ステート
        this.states().forEach(function(state) {
            if (state) {
                if (state.meta.srpgReactionSkill) array.unshift(Number(state.meta.srpgReactionSkill));
                if (state.meta.srpgCounter === 'false') array.unshift(0);
            }
        }, this);
        return array;
    };

    // 代替スキルのIDを返す
    Game_Actor.prototype.srpgAlternativeSkillId = function() {
        var id = this.actor().meta.srpgAlternativeSkillId ? this.actor().meta.srpgAlternativeSkillId : this.attackSkillId();
        return id;
    };

    // 通行可能タグを返す（class, equip, stateの設定で最大の物を採用する）
    Game_Actor.prototype.srpgThroughTag = function() {
        var n = 0;
        // 職業
        if (this.currentClass().meta.srpgThroughTag && n < Number(this.currentClass().meta.srpgThroughTag)) {
            n = Number(this.currentClass().meta.srpgThroughTag);
        }
        // ステート
        this.states().forEach(function(state) {
            if (state.meta.srpgThroughTag && n < Number(state.meta.srpgThroughTag)) {
                n = Number(state.meta.srpgThroughTag);
            }
        }, this);
        // 装備
        var equips = this.equips();
        for (var i = 0; i < equips.length; i++) {
            var item = equips[i];
            if (this.isEquipValid(item) && item.meta.srpgThroughTag && n < Number(item.meta.srpgThroughTag)) {
                n = Number(item.meta.srpgThroughTag);
            }
        }
        return n;
    };

    // 入手経験値の割合を返す
    Game_Actor.prototype.expRate = function() {
        if (this.isMaxLevel()) {
            var rate = 1.0;
        } else {
            var rate = (this.currentExp() - this.currentLevelExp()) / (this.nextLevelExp() - this.currentLevelExp());
        }
        return rate;
    };

    // 装備変更可能かを返す
    Window_EquipSlot.prototype.isEnabled = function(index) {
        return this._actor ? this._actor.isEquipChangeOk(index) : false;
    };

    var _SRPG_Game_Actor_isEquipChangeOk = Game_Actor.prototype.isEquipChangeOk;
    Game_Actor.prototype.isEquipChangeOk = function(slotId) {
        if ($gameSystem.isSRPGMode() === true) {
            if (this.srpgTurnEnd() === true || this.isRestricted() === true) {
                return false;
            } else {
                return _SRPG_Game_Actor_isEquipChangeOk.call(this, slotId);
            }
        } else {
            return _SRPG_Game_Actor_isEquipChangeOk.call(this, slotId);
        }
    };

    // アクターコマンドで装備が可能か返す（移動後は不可：装備変更で移動力が変わる可能性があるため）
    Game_Actor.prototype.canSrpgEquip = function() {
        return $gameTemp.originalPos()[0] === $gameTemp.activeEvent().posX() &&
               $gameTemp.originalPos()[1] === $gameTemp.activeEvent().posY();
    };

    //----------------------------------------------------------------
    // actionの設定
    //----------------------------------------------------------------
    // 行動に通常攻撃を設定する
    Game_Actor.prototype.setActionAttack = function() {
        this.clearActions();
        this._actions = [];
        this._actions.push(new Game_Action(this));
        this._actions[0].setSkill(this.attackSkillId());
    };

    // 自動行動を決定する
    var _SRPG_Game_Actor_makeAutoBattleActions = Game_Actor.prototype.makeAutoBattleActions;
    Game_Actor.prototype.makeAutoBattleActions = function() {
        if ($gameSystem.isSRPGMode() === true) {
            for (var i = 0; i < this.numActions(); i++) {
                var list = this.makeActionList();
                this.setAction(i, list[Math.randomInt(list.length)]);
            }
            this.setActionState('waiting');
        } else {
            return _SRPG_Game_Actor_makeAutoBattleActions.call(this);
        }
    };

//====================================================================
// ●Game_Enemy
//====================================================================
    //----------------------------------------------------------------
    // 初期化・初期設定
    //----------------------------------------------------------------
    // levelを返す
    Object.defineProperty(Game_Enemy.prototype, 'level', {
        get: function() {
            return this._level;
        },
        configurable: true
    });

    var _SRPG_Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    Game_Enemy.prototype.initMembers = function() {
        _SRPG_Game_Enemy_initMembers.call(this);
        this._level = 0;
    };
    
    var _SRPG_Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _SRPG_Game_Enemy_setup.call(this, enemyId, x, y);
        this._level = this.enemy().meta.srpgLevel ? Number(this.enemy().meta.srpgLevel) : 0;
    };

    //----------------------------------------------------------------
    // SRPG戦闘に関するパラメータ
    //----------------------------------------------------------------
    // 移動力を返す
    Game_Enemy.prototype.srpgMove = function() {
        // SRPG_RangeControl.jsで再定義する
    };

    // スキル・アイテムの射程を返す
    Game_Enemy.prototype.srpgSkillRange = function(skill) {
        // SRPG_RangeControl.jsで再定義するvar range = 1;
    };

    // スキル・アイテムの最低射程を返す
    Game_Enemy.prototype.srpgSkillMinRange = function(skill) {
        // SRPG_RangeControl.jsで再定義する
    };

    // 武器の攻撃射程を返す
    Game_Enemy.prototype.srpgWeaponRange = function() {
        return this.srpgSkillRange($dataSkills[this.attackSkillId()]);
    };

    // 武器の最低射程を返す
    Game_Enemy.prototype.srpgWeaponMinRange = function() {
        return this.srpgSkillMinRange($dataSkills[this.attackSkillId()]);
    };

    // 武器の特殊射程の形状を返す
    Game_Enemy.prototype.srpgWeaponSpecialRange = function() {
        var value = Game_BattlerBase.prototype.srpgWeaponSpecialRange.call(this);
        if (!this.hasNoWeapons()) {
            var weapon = $dataWeapons[this.enemy().meta.srpgWeapon];
            if (weapon && weapon.meta.specialRange) {
                value = weapon.meta.specialRange;
            } else if (this.enemy().meta.specialRange) {
                value = this.enemy().meta.specialRange;
            }
        } else if (this.enemy().meta.specialRange) {
            value = this.enemy().meta.specialRange;
        }
        return value;
    };

    // 応戦に使用するスキルのリストを返す
    Game_Enemy.prototype.srpgReactionSkill = function() {
        var array = [];
        // プラグインのデフォルト
        array.unshift(_srpgDefaultReactionSkill);
        // エネミー
        if (this.enemy().meta.srpgReactionSkill) array.unshift(Number(this.enemy().meta.srpgReactionSkill));
        if (this.enemy().meta.srpgCounter === 'false') array.unshift(0);
        // 装備
        var weapon = $dataWeapons[Number(this.enemy().meta.srpgWeapon)];
        if (this.isEquipValid(weapon)) {
            if (weapon.meta.srpgReactionSkill) array.unshift(Number(weapon.meta.srpgReactionSkill));
            if (weapon.meta.srpgCounter === 'false') array.unshift(0);
        }
		// ステート
        this.states().forEach(function(state) {
            if (state) {
                if (state.meta.srpgReactionSkill) array.unshift(Number(state.meta.srpgReactionSkill));
                if (state.meta.srpgCounter === 'false') array.unshift(0);
            }
        }, this);
        return array;
    };

    // 代替スキルのIDを返す
    Game_Enemy.prototype.srpgAlternativeSkillId = function() {
        var id = this.enemy().meta.srpgAlternativeSkillId ? this.enemy().meta.srpgAlternativeSkillId : this.attackSkillId();
        return id;
    };

    // 通行可能タグを返す（enemy, equip, stateの設定で最大の物を採用する）
    Game_Enemy.prototype.srpgThroughTag = function() {
        var n = 0;
        // エネミー
        if (this.enemy().meta.srpgThroughTag && n < Number(this.enemy().meta.srpgThroughTag)) {
            n = Number(this.enemy().meta.srpgThroughTag);
        }
        // ステート
        this.states().forEach(function(state) {
            if (state.meta.srpgThroughTag && n < Number(state.meta.srpgThroughTag)) {
                n = Number(state.meta.srpgThroughTag);
            }
        }, this);
        // 装備
        var weapon = $dataWeapons[Number(this.enemy().meta.srpgWeapon)];
        if (this.isEquipValid(weapon) && weapon.meta.srpgThroughTag && n < Number(weapon.meta.srpgThroughTag)) {
            n = Number(weapon.meta.srpgThroughTag);
        }
        return n;
    };

    // 装備が設定されていない（素手）の時のアニメーションID
    Game_Enemy.prototype.bareHandsAnimationId = function() {
        return 1;
    };

    // 武器を装備しているか返す
    Game_Enemy.prototype.hasNoWeapons = function() {
        var flag = !$dataWeapons[Number(this.enemy().meta.srpgWeapon)];
        this.states().forEach(function(state) {
            if (state && state.meta.srpgWeaponBreak) flag = true;
        }, this);
        return flag;
    };

    // attackSkillId == 1 以外の武器を作る
    Game_Enemy.prototype.attackSkillId = function() {
        // プラグインのデフォルト
        var value = Game_BattlerBase.prototype.attackSkillId.call(this);
        // エネミー
        if (this.enemy().meta.srpgWeaponSkill) value = Number(this.enemy().meta.srpgWeaponSkill);
        // 装備 (将来的には、武器以外も作る？)
        var weapon = $dataWeapons[Number(this.enemy().meta.srpgWeapon)];
        if (this.isEquipValid(weapon)) {
            if (weapon.meta.srpgWeaponSkill) value = Number(weapon.meta.srpgWeaponSkill);
        }
		// ステート
        this.states().forEach(function(state) {
            if (state && state.meta.srpgWeaponSkill) value = Number(state.meta.srpgWeaponSkill);
        }, this);
        return value;
    };

    // 装備の特徴を反映する
    var _SRPG_Game_Enemy_traitObjects = Game_Enemy.prototype.traitObjects;
    Game_Enemy.prototype.traitObjects = function() {
        var objects = _SRPG_Game_Enemy_traitObjects.call(this);
        if ($gameSystem.isSRPGMode() === true) {
            var weapon = $dataWeapons[Number(this.enemy().meta.srpgWeapon)];
            if (this.isEquipValid(weapon)) {
                objects.push(weapon);
            }
        }
        return objects;
    };

    // 装備の能力変化値を反映する
    Game_Enemy.prototype.paramPlus = function(paramId) {
        var value = Game_Battler.prototype.paramPlus.call(this, paramId);
        if ($gameSystem.isSRPGMode() === true) {
            var weapon = $dataWeapons[Number(this.enemy().meta.srpgWeapon)];
            if (this.isEquipValid(weapon)) {
                value += weapon.params[paramId];
            }
        }
        return value;
    };

    // 装備のアニメーションを反映する
    Game_Enemy.prototype.attackAnimationId = function() {
        if (this.hasNoWeapons()) {
            return this.bareHandsAnimationId();
        } else {
            var weapons = $dataWeapons[Number(this.enemy().meta.srpgWeapon)];
            return weapons ? weapons.animationId : 1;
        }
    };

    //----------------------------------------------------------------
    // actionの設定
    //----------------------------------------------------------------
    // 行動に通常攻撃を設定する
    Game_Enemy.prototype.setActionAttack = function() {
        this.clearActions();
        this._actions = [];
        this._actions.push(new Game_Action(this));
        this._actions[0].setSkill(this.attackSkillId());
    };

    // SRPG用の行動決定
    Game_Enemy.prototype.makeSrpgActions = function() {
        Game_Battler.prototype.makeActions.call(this);
        if (this.numActions() > 0) {
            if (this.isConfused()) {
                this.makeConfusionActions();
            } else {
                var actionList = this.enemy().actions.filter(function(a) {
                    if (a.skillId === 1) {
                        a.skillId = this.attackSkillId();
                    }
                    return this.isActionValid(a);
                }, this);
                if (actionList.length > 0) {
                    this.selectAllActions(actionList);
                }
            }
        }
        this.setActionState('waiting');
    };

    // 混乱状態の時の行動決定
    Game_Enemy.prototype.makeConfusionActions = function() {
        for (var i = 0; i < this.numActions(); i++) {
            this.action(i).setConfusion();
        }
    };

    //----------------------------------------------------------------
    // 戦闘画面での画像表示
    //----------------------------------------------------------------
    // メモから座標の補正値を取得する
    Game_Enemy.prototype.correctionX = function() {
        if (this.enemy().meta.srpgCorrectionX) return Number(this.enemy().meta.srpgCorrectionX);
        return 0;
    };

    Game_Enemy.prototype.correctionY = function() {
        if (this.enemy().meta.srpgCorrectionY) return Number(this.enemy().meta.srpgCorrectionY);
        return 0;
    };

    // 戦闘画面での座標を設定する
    Game_Enemy.prototype.setScreenXy = function(x, y) {
        this._screenX = x;
        this._screenY = y;
    };

//====================================================================
// ●Game_Unit
//====================================================================
    //----------------------------------------------------------------
    // 戦闘終了時の処理
    //----------------------------------------------------------------
    // 戦闘画面終了時には、ユニットの戦闘終了時の処理をスキップする
    var _SRPG_Game_Unit_onBattleEnd = Game_Unit.prototype.onBattleEnd;
    Game_Unit.prototype.onBattleEnd = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this._inBattle = false;
        } else {
            _SRPG_Game_Unit_onBattleEnd.call(this);
        }
    };

//====================================================================
// ●Game_Party
//====================================================================
    //----------------------------------------------------------------
    // 初期化
    //----------------------------------------------------------------
    var _SRPG_Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _SRPG_Game_Party_initialize.call(this);
        this._srpgBattleActors = []; 
    };

    //----------------------------------------------------------------
    // メンバーの呼び出し
    //----------------------------------------------------------------
    // SRPGの戦闘画面に呼び出すメンバーを返す
    Game_Party.prototype.SrpgBattleActors = function() {
        return this._srpgBattleActors;
    };

    //SRPGモードの戦闘時に呼び出すメンバーを初期化する
    Game_Party.prototype.clearSrpgBattleActors = function() {
        this._srpgBattleActors = [];
    };

    //SRPGモードの戦闘時に呼び出すメンバーを加える（行動者と対象者）
    Game_Party.prototype.pushSrpgBattleActors = function(actor) {
        this._srpgBattleActors.push(actor);
    };

    // SRPG戦闘中にはmembersで呼び出す配列を変える
    var _SRPG_Game_Party_members = Game_Party.prototype.members;
    Game_Party.prototype.members = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if ($gameSystem.isSubBattlePhase() === 'initialize' || 
                $gameSystem.isSubBattlePhase() === 'normal' ||
                $gameSystem.isSubBattlePhase() === 'actor_command_window') {
                return this.allMembers();
            } else {
                return this.battleMembers();
            }
        } else {
            return _SRPG_Game_Party_members.call(this);
        }
    };

    // SRPG戦闘中にはbattleMembersで呼び出す配列を変える
    var _SRPG_Game_Party_battleMembers = Game_Party.prototype.battleMembers;
    Game_Party.prototype.battleMembers = function() {
        if ($gameSystem.isSRPGMode() === true) {
            return this.SrpgBattleActors();
        } else {
            return _SRPG_Game_Party_battleMembers.call(this);
        }
    };

    // SRPG戦闘中にはallMembersで呼び出す配列を変える
    // メニューではパーティメンバーだけでなく、戦闘に参加しているアクターを全て選び出す
    var _SRPG_Game_Party_allMembers = Game_Party.prototype.allMembers;
    Game_Party.prototype.allMembers = function() {
        if ($gameSystem.isSRPGMode() === true && $gameSystem.isSubBattlePhase() !== 'initialize') {
            var _list = [];
            for (var i = 0; i < $gameSystem.srpgAllActors().length; i++) {
                var actor = $gameSystem.EventToUnit($gameSystem.srpgAllActors()[i])[1];
                _list.push(actor);
            }
            return _list;
        } else {
            return _SRPG_Game_Party_allMembers.call(this);
        }
    };

    //----------------------------------------------------------------
    // プレイヤーの移動に関する処理
    //----------------------------------------------------------------
    //プレイヤー移動時の処理（SRPG戦闘中はスキップする）
    var _SRPG_Game_Party_onPlayerWalk = Game_Party.prototype.onPlayerWalk;
    Game_Party.prototype.onPlayerWalk = function() {
        if ($gameSystem.isSRPGMode() === false) {
            return _SRPG_Game_Party_onPlayerWalk.call(this);
        }
    };

    //----------------------------------------------------------------
    // セーブファイルの処理
    //----------------------------------------------------------------
    // 戦闘に参加しているメンバーのグラフィックを返す
    var _SRPG_Game_Party_charactersForSavefile = Game_Party.prototype.charactersForSavefile;
    Game_Party.prototype.charactersForSavefile = function() {
        if ($gameSystem.isSRPGMode() === true) {
            return this.allMembers().map(function(actor) {
                return [actor.characterName(), actor.characterIndex()];
            });
        } else {
            return _SRPG_Game_Party_charactersForSavefile.call(this);
        }
    };

    var _SRPG_Game_Party_facesForSavefile = Game_Party.prototype.facesForSavefile;
    Game_Party.prototype.facesForSavefile = function() {
        if ($gameSystem.isSRPGMode() === true) {
            return this.allMembers().map(function(actor) {
                return [actor.faceName(), actor.faceIndex()];
            });
        } else {
            return _SRPG_Game_Party_facesForSavefile.call(this);
        }
    };

//====================================================================
// ●Game_Troop
//====================================================================
    //----------------------------------------------------------------
    // 初期化
    //----------------------------------------------------------------
    var _Game_Troop_initialize = Game_Troop.prototype.initialize
    Game_Troop.prototype.initialize = function() {
        _Game_Troop_initialize.call(this);
        this._srpgBattleEnemys = []; 
    };

    //----------------------------------------------------------------
    // ターンの設定
    //----------------------------------------------------------------
    //SRPGモード時はSRPG戦闘におけるターン数を返す
    var _Game_Troop_turnCount = Game_Troop.prototype.turnCount
    Game_Troop.prototype.turnCount = function() {
        if ($gameSystem.isSRPGMode()){
            return $gameVariables.value(_turnVarID);
        } else {
            return _Game_Troop_turnCount.call(this);
        }
    };

    //----------------------------------------------------------------
    // メンバーの呼び出し
    //----------------------------------------------------------------
    //SRPGモードの戦闘時に呼び出すメンバーを返す
    Game_Troop.prototype.SrpgBattleEnemys = function() {
        return this._srpgBattleEnemys;
    };

    //SRPGモードの戦闘時に呼び出すメンバーを初期化する
    Game_Troop.prototype.clearSrpgBattleEnemys = function() {
        this._srpgBattleEnemys = [];
    };

    //SRPGモードの戦闘時に呼び出すメンバーを加える（行動者と対象者）
    Game_Troop.prototype.pushSrpgBattleEnemys = function(enemy) {
        this._srpgBattleEnemys.push(enemy);
    };

    //----------------------------------------------------------------
    // トループの初期設定
    //----------------------------------------------------------------
    // トループにメンバーを加える
    Game_Troop.prototype.pushMembers = function(enemy) {
        this._enemies.push(enemy);
    };

    // セットアップ
    var _SRPG_Game_Troop_setup = Game_Troop.prototype.setup;
    Game_Troop.prototype.setup = function(troopId) {
        if ($gameSystem.isSRPGMode() === true) {
            this.clear();
            this._troopId = troopId;
            this._enemies = [];
            for (var i = 0; i < this.SrpgBattleEnemys().length; i++) {
                var enemy = this.SrpgBattleEnemys()[i];
                enemy.setScreenXy(Graphics.width / 4 + 240 * i + enemy.correctionX(), Graphics.height / 2 + 48 + enemy.correctionY());
                this._enemies.push(enemy);
            }
            this.makeUniqueNames();
        } else {
            _SRPG_Game_Troop_setup.call(this, troopId);
        }
    };

    //----------------------------------------------------------------
    // 入手EXPの処理
    //----------------------------------------------------------------
    // エネミーを倒したときは設定値のまま、倒していない時は入手経験値割合に応じてEXPを入手する
    // 戦闘にアクターしかいない場合も、設定された割合に応じてEXPを入手する
    var _SRPG_Game_Troop_expTotal = Game_Troop.prototype.expTotal;
    Game_Troop.prototype.expTotal = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if (this.SrpgBattleEnemys() && this.SrpgBattleEnemys().length > 0) {
                if (this.isAllDead()) {
                    return _SRPG_Game_Troop_expTotal.call(this);
                } else {
                    var exp = 0;
                    for (var i = 0; i < this.members().length; i++) {
                        var enemy = this.members()[i];
                        exp += enemy.exp();
                    }
                    return Math.floor(exp * _srpgBattleExpRate);
                }
            } else {
                var actor = $gameParty.battleMembers()[0];
                var exp = actor.nextLevelExp() - actor.currentLevelExp();
                return Math.floor(exp * _srpgBattleExpRateForActors);
            }
        } else {
            return _SRPG_Game_Troop_expTotal.call(this);
        }
    };

//====================================================================
// ●Game_CharacterBase
//====================================================================
    //----------------------------------------------------------------
    // 基本的なパラメータを返す
    //----------------------------------------------------------------
    // X座標を返す
    Game_CharacterBase.prototype.posX = function() {
        return this._x;
    };

    // Y座標を返す
    Game_CharacterBase.prototype.posY = function() {
        return this._y;
    };

    // イベントかどうかを返す
    Game_CharacterBase.prototype.isEvent = function() {
        return false;
    };

    //----------------------------------------------------------------
    // SRPG戦闘用の設定変更
    //----------------------------------------------------------------
    // プレイヤーの移動速度を変える（自動移動中は高速化）
    var _SRPG_Game_CharacterBase_realMoveSpeed = Game_CharacterBase.prototype.realMoveSpeed;
    Game_CharacterBase.prototype.realMoveSpeed = function() {
        if ($gameSystem.isSRPGMode() === true && 
           ($gameTemp.isAutoMoveDestinationValid() === true || $gameTemp.isDestinationValid() === true)) {
            return 6;
        } else {
            return _SRPG_Game_CharacterBase_realMoveSpeed.call(this);
        }
    };

    // 戦闘中はキャラクターがすり抜けて移動するように変更する
    var _SRPG_Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        if ($gameSystem.isSRPGMode() === true) {
            var x2 = $gameMap.roundXWithDirection(x, d);
            var y2 = $gameMap.roundYWithDirection(y, d);
            if (!$gameMap.isValid(x2, y2)) {
                return false;
            }
            return true;
        } else {
            return _SRPG_Game_CharacterBase_canPass.call(this, x, y, d);
        }
    };

    //----------------------------------------------------------------
    // 移動範囲の計算に関わる処理
    //----------------------------------------------------------------
    // 対立陣営であれば通り抜けられない（移動範囲演算用） objectも一緒に処理する
    Game_CharacterBase.prototype.isSrpgCollidedWithEvents = function(x, y) {
        var events = $gameMap.eventsXyNt(x, y);
        return events.some(function(event) {
            if ((event.isType() === 'actor' && $gameTemp.activeEvent().isType() === 'enemy') ||
                (event.isType() === 'enemy' && $gameTemp.activeEvent().isType() === 'actor') ||
                (event.isType() === 'object' && event.characterName() !== '') && !event.isErased()) {
                return true;
            } else {
                return false;
            }
        });
    };

    // 移動可能かを判定する（移動範囲演算用）
    Game_CharacterBase.prototype.srpgMoveCanPass = function(x, y, d, tag) {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (this.isSrpgCollidedWithEvents(x2, y2)) {
            return false;
        }
        if (($gameMap.terrainTag(x2, y2) > 0 && $gameMap.terrainTag(x2, y2) <= tag) ||
            ($gameMap.terrainTag(x, y) > 0 && $gameMap.terrainTag(x, y) <= tag &&
             $gameMap.isPassable(x2, y2, this.reverseDir(d)))) {
            return true;
        }
        if (!this.isMapPassable(x, y, d)) {
            return false;
        }
        return true;
    };

    // 移動範囲の計算
    Game_CharacterBase.prototype.makeMoveTable = function(x, y, move, route, tag) {
        // SRPG_RangeControl.jsで再定義する
    };

    //----------------------------------------------------------------
    // 攻撃範囲（射程）の計算に関わる処理
    //----------------------------------------------------------------
    // 通行可能かを判定する（攻撃射程演算用）
    Game_CharacterBase.prototype.srpgRangeCanPass = function(x, y, d) {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (_srpgRangeTerrainTag7 === 'true' && $gameMap.terrainTag(x2, y2) == 7) {
            return false;
        }
        return true;
    };

    // 射程範囲から最低射程を除く
    Game_CharacterBase.prototype.srpgMinRangeAdapt = function(x, y, oriX, oriY, skill) {
        var newList = [];
        for (var i = 0; i < this._RangeList.length; i++) {
            var x = this._RangeList[i][0];
            var y = this._RangeList[i][1];
            var dis = Math.abs(x - oriX) + Math.abs(y - oriY);
            if (dis >= minRange) {
                newList.push(this._RangeList[i]);
            }
        }
        this._RangeList = [];
        this._RangeList = newList;
    };
    
    // 特殊射程の処理
    Game_CharacterBase.prototype.srpgRangeExtention = function(x, y, oriX, oriY, skill, range) {
        if (!skill) return false;
        var specialRange = skill.meta.specialRange;
        if (specialRange === 'weapon') {
            var battler = $gameSystem.EventToUnit(this.eventId())[1];
            specialRange = battler.srpgWeaponSpecialRange();
        }
        switch (specialRange) {
        case 'king': 
            if ((Math.abs(x - oriX) <= range / 2) && (Math.abs(y - oriY) <= range / 2)) {
                return true;
            } else {
                return false;
            }
        case 'queen': 
            if ((x === oriX || y === oriY) || (Math.abs(x - oriX) === Math.abs(y - oriY))) {
                return true;
            } else {
                return false;
            }
        case 'rook': 
        case 'luke': 
            if (x === oriX || y === oriY) {
                return true;
            } else {
                return false;
            }
        case 'bishop': 
            if (Math.abs(x - oriX) === Math.abs(y - oriY)) {
                return true;
            } else {
                return false;
            }
        case 'knight': 
            if (!((x === oriX || y === oriY) || (Math.abs(x - oriX) === Math.abs(y - oriY)))) {
                return true;
            } else {
                return false;
            }
        default:
            return true;
        }
    };

    // 攻撃射程の計算
    Game_CharacterBase.prototype.makeRangeTable = function(x, y, range, route, oriX, oriY, skill) {
        // SRPG_RangeControl.jsで再定義する
    };

    //----------------------------------------------------------------
    // イベントの出現（増援）の処理
    //----------------------------------------------------------------
    // 移動可能かを判定する（イベント出現時用）
    Game_CharacterBase.prototype.srpgAppearCanPass = function(x, y, d, tag) {
        var x2 = $gameMap.roundXWithDirection(x, d);
        var y2 = $gameMap.roundYWithDirection(y, d);
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        if (($gameMap.terrainTag(x2, y2) > 0 && $gameMap.terrainTag(x2, y2) <= tag) ||
            ($gameMap.terrainTag(x, y) > 0 && $gameMap.terrainTag(x, y) <= tag &&
             $gameMap.isPassable(x2, y2, this.reverseDir(d)))) {
            return true;
        }
        if (!this.isMapPassable(x, y, d)) {
            return false;
        }
        return true;
    };

    Game_CharacterBase.prototype.makeAppearPoint = function(eventSelf, x, y, throughTag, previous) {
        var edges = [];
        edges.push([x, y, 0]);
        makeAppPointBreak: for (var i = 0; i < edges.length; i++) {
            var newX = edges[i][0];
            var newY = edges[i][1];
            var previous = edges[i][2];
            var events = $gameMap.eventsXyNt(newX, newY);
            if (events.length === 0) break;
            if (events.length === 1 && events[0] === eventSelf) break;
            for (var num = 0; num < events.length; num++) {
                var event = events[num];
                if (['actor', 'enemy', 'object', 'playerEvent'].indexOf(event.isType()) < 0) break makeAppPointBreak;
            }
            for (var d = 2; d < 10; d += 2) {
                if (this.srpgAppearCanPass(newX, newY, d, throughTag) && previous !== (10 - d)) {
                    switch (d) {
                        case 2:
                            edges.push([newX, newY + 1, d]);
                        case 4:
                            edges.push([newX - 1, newY, d]);
                        case 6:
                            edges.push([newX + 1, newY, d]);
                        case 8:
                            edges.push([newX, newY - 1, d]);
                    } 
                }
            }

        }
        return [newX, newY];
    };

//====================================================================
// ●Game_Player
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘中に必要な変更
    //----------------------------------------------------------------
    //プレイヤーの画像を変更する
    var _SRPG_Game_Player_refresh = Game_Player.prototype.refresh;
    Game_Player.prototype.refresh = function() {
        if ($gameSystem.isSRPGMode() === true) {
            var characterName = _srpgSet;
            var characterIndex = 0;
            this.setImage(characterName, characterIndex);
            this._followers.refresh();
        } else {
            _SRPG_Game_Player_refresh.call(this);
        }
    };

    //----------------------------------------------------------------
    // プレイヤーの移動に関係する処理
    //----------------------------------------------------------------
    //戦闘中、サブフェーズの状況に応じてプレイヤーの移動を制限する
    var _SRPG_Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if ($gameSystem.srpgWaitMoving() === true ||
                $gameSystem.isSubBattlePhase() === 'status_window' ||
                $gameSystem.isSubBattlePhase() === 'actor_command_window' ||
                $gameSystem.isSubBattlePhase() === 'battle_window' ||
                $gameSystem.isBattlePhase() === 'auto_actor_phase' ||
                $gameSystem.isBattlePhase() === 'enemy_phase') {
                return false;
            }
        }
        return _SRPG_Game_Player_canMove.call(this);
    };

    //プレイヤーの自動移動を設定する
    var _SRPG_Game_Player_moveByInput = Game_Player.prototype.moveByInput;
    Game_Player.prototype.moveByInput = function() {
        if ($gameSystem.isSRPGMode() === true && $gameTemp.isAutoMoveDestinationValid() === true &&
            !this.isMoving()) {
            // 移動先と現在地の関係を計算する
            var x = $gameTemp.autoMoveDestinationX() - this.x;
            var y = $gameTemp.autoMoveDestinationY() - this.y;
            if ($gameMap.isLoopHorizontal() === true) {
                var minDisX = Math.abs($gameTemp.autoMoveDestinationX() - this.x);
                var destX = $gameTemp.autoMoveDestinationX() > this.x ? $gameTemp.autoMoveDestinationX() - $gameMap.width() : $gameTemp.autoMoveDestinationX() + $gameMap.width();
                var disX = Math.abs(destX - this.x);
                x = minDisX < disX ? x : x * -1;
            }
            if ($gameMap.isLoopVertical() === true) {
                var minDisY = Math.abs($gameTemp.autoMoveDestinationY() - this.y);
                var destY = $gameTemp.autoMoveDestinationY() > this.y ? $gameTemp.autoMoveDestinationY() - $gameMap.height() : $gameTemp.autoMoveDestinationY() + $gameMap.height();
                var disY = Math.abs(destY - this.y);
                y = minDisY < disY ? y : y * -1;
            }
            // 移動先に合わせて移動を設定する
            if (x < 0) {
                if (y < 0) {
                    this.moveDiagonally(4, 8);
                } else if (y === 0) {
                    this.moveStraight(4);
                } else if (y > 0) {
                    this.moveDiagonally(4, 2);
                }
            } else if (x == 0) {
                if (y < 0) {
                    this.moveStraight(8);
                } else if (y === 0) {
                    $gameTemp.setAutoMoveDestinationValid(false);
                    $gameTemp.setAutoMoveDestination(-1, -1);
                } else if (y > 0) {
                    this.moveStraight(2);
                }
            } else if (x > 0) {
                if (y < 0) {
                    this.moveDiagonally(6, 8);
                } else if (y === 0) {
                    this.moveStraight(6);
                } else if (y > 0) {
                    this.moveDiagonally(6, 2);
                }
            }
        } else {
            _SRPG_Game_Player_moveByInput.call(this);
        }
    };

    //----------------------------------------------------------------
    // キー入力に関係する処理
    //----------------------------------------------------------------
    // キャンセルボタンの許可
    Game_Player.prototype.isCancelButtonEnabled = function() {
        if ($gameSystem.isSubBattlePhase() === 'actor_move' ||
            $gameSystem.isSubBattlePhase() === 'actor_command_window' ||
            $gameSystem.isSubBattlePhase() === 'actor_target') {
            return true;
        } else {
            return false;
        }
    };

    // タッチした場所にキャンセルボタンが存在するかの判定
    // 仕様上、マップの一番右上にはタッチで移動できなくなる
    Game_Player.prototype.touchOnCancelButton = function() {
        if (!ConfigManager.touchUI) return false;
        const cancelButton = new Sprite_Button("cancel");
        return $gameSystem.isSRPGMode() && this.isCancelButtonEnabled() &&
               (TouchInput.x >= cancelButton.x && TouchInput.y <= cancelButton.y * 2 + cancelButton.height);
    };

    //戦闘中、サブフェーズの状況に応じて決定キー・タッチの処理を変える
    var _SRPG_Game_Player_triggerAction = Game_Player.prototype.triggerAction;
    Game_Player.prototype.triggerAction = function() {
        if ($gameSystem.isSRPGMode() === true) {
            // 自動行動中など、不適切な時は機能しない
            if ($gameSystem.srpgWaitMoving() === true ||
                $gameTemp.isAutoMoveDestinationValid() === true ||
                $gameSystem.isSubBattlePhase() === 'actor_command_window' ||
                $gameSystem.isSubBattlePhase() === 'battle_window' ||
                $gameSystem.isBattlePhase() === 'auto_actor_phase' ||
                $gameSystem.isBattlePhase() === 'enemy_phase') {
                return false;
            // ステータスウィンドウの表示時
            } else if ($gameSystem.isSubBattlePhase() === 'status_window') {
                if (Input.isTriggered('ok') || TouchInput.isTriggered()) {
                    var battlerArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
                    $gameSystem.clearSrpgStatusWindowNeedRefresh();
                    SoundManager.playCancel();
                    $gameTemp.clearActiveEvent();
                    $gameSystem.setSubBattlePhase('normal');
                    $gameTemp.clearMoveTable();
                    if ($gameSystem.isBattlePhase() === 'battle_prepare') {
                        $gameTemp.setResetMoveList(true);
                        $gameTemp.srpgMakePrepareTable();
                    }
                    return true;
                }
                return false;
            // アクターの移動先選択時
            } else if ($gameSystem.isSubBattlePhase() === 'actor_move') {
                if (Input.isTriggered('ok') || (TouchInput.isTriggered() && !this.touchOnCancelButton())) {
                    var list = $gameTemp.moveList();
                    for (var i = 0; i < list.length; i++) {
                        var pos = list[i];
                        if (pos[2] === false && pos[0] === this._x && pos[1] === this._y) {
                            if ($gameSystem.areTheyNoUnits(this._x, this._y)) {
                                SoundManager.playOk();
                                var route = $gameTemp.MoveTable(pos[0], pos[1])[1];
                                var event = $gameTemp.activeEvent();
                                var battlerArray = $gameSystem.EventToUnit(event.eventId());
                                // キャラクターを移動させる
                                $gameSystem.setSrpgWaitMoving(true);
                                event.srpgMoveRouteForce(route);
                                battlerArray[1].srpgMakeNewActions();
                                battlerArray[1].setMovedStep(route.length - 1);
                                $gameSystem.setSrpgActorCommandWindowNeedRefresh(battlerArray);
                                // アクターコマンドを開始
                                $gameSystem.setSubBattlePhase('actor_command_window');
                            } else {
                                SoundManager.playBuzzer();
                            }
                        }
                    }
                    return true;
                }
                return false;
            } else {
                return _SRPG_Game_Player_triggerAction.call(this);
            }
        } else {
            return _SRPG_Game_Player_triggerAction.call(this);
        }
    };

    //----------------------------------------------------------------
    // イベントの起動に関係する処理
    //----------------------------------------------------------------
    // 戦闘中、ユニット上で決定キーが押された時の処理
    // 戦闘中、通常のイベント内容は起動しないようにする
    // 戦闘中はユニットが選択されたと判断して、移動範囲演算とステータスの表示を行う(行動可能アクターなら行動する)。
    var _SRPG_Game_Player_startMapEvent = Game_Player.prototype.startMapEvent;
    Game_Player.prototype.startMapEvent = function(x, y, triggers, normal) {
        if ($gameSystem.isSRPGMode() === true) {
            if (!$gameMap.isEventRunning() && $gameSystem.isBattlePhase() === 'actor_phase') {
                // サブフェーズがnormal（ユニットを選択する状態）の時
                if ($gameSystem.isSubBattlePhase() === 'normal') {
                    $gameMap.eventsXy(x, y).forEach(function(event) {
                        if (event.isTriggerIn(triggers) && !event.isErased()) {
                            // 選択されたユニットがアクターの場合
                            if (event.isType() === 'actor') {
                                SoundManager.playOk();
                                $gameTemp.setActiveEvent(event);
                                $gameSystem.srpgMakeMoveTable(event);
                                var battlerArray = $gameSystem.EventToUnit(event.eventId());
                                // 行動可能なら移動の処理に移る
                                if (battlerArray[1].canInput() === true) {
                                    $gameParty.pushSrpgBattleActors(battlerArray[1]);
                                    $gameTemp.reserveOriginalPos($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY());
                                    $gameSystem.setSrpgActorCommandStatusWindowNeedRefresh(battlerArray);
                                    $gameSystem.setSubBattlePhase('actor_move');
                                } else {
                                    $gameSystem.setSrpgStatusWindowNeedRefresh(battlerArray);
                                    $gameSystem.setSubBattlePhase('status_window');
                                }
                                return;
                            // 選択されたユニットがエネミーの場合
                            } else if (event.isType() === 'enemy') {
                                SoundManager.playOk();
                                $gameTemp.setActiveEvent(event);
                                $gameSystem.srpgMakeMoveTable(event);
                                var battlerArray = $gameSystem.EventToUnit(event.eventId());
                                $gameSystem.setSrpgStatusWindowNeedRefresh(battlerArray);
                                $gameSystem.setSubBattlePhase('status_window');
                                return;
                            // 選択されたユニットがプレイヤーイベントの場合
                            } else if (event.isType() === 'playerEvent') {
                                if (event.pageIndex() >= 0) event.start();
                                return;
                            }
                        }
                    });
                // サブフェーズがactor_target（対象を選んでいる状態）の時
                } else if ($gameSystem.isSubBattlePhase() === 'actor_target') {
                    $gameMap.eventsXy(x, y).forEach(function(event) {
                        if (event.isTriggerIn(triggers) && !event.isErased()) {
                            // アクター、またはエネミーが選択された場合
                            if (event.isType() === 'actor' || event.isType() === 'enemy') {
                                var actionArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
                                var targetArray = $gameSystem.EventToUnit(event.eventId());
                                if (targetArray[0] === 'actor' && actionArray[1].currentAction().isForFriend() ||
                                    targetArray[0] === 'enemy' && actionArray[1].currentAction().isForOpponent()) {
                                    // 戦闘開始ウィンドウを開始する（canUseの判定のため、先にsub phase設定する）
                                    $gameSystem.setSubBattlePhase('battle_window');
                                    // ターゲットイベントを設定する
                                    $gameTemp.setTargetEvent(event);
                                    // 戦闘シーンのセッティング
                                    $gameSystem.setupSrpgBattleScene(actionArray, targetArray);
                                    // バトルウィンドウをスキップする設定で行動出来ない場合はターゲット選択に戻す
                                    var skill = actionArray[1].currentAction().item();
                                    if (_srpgPredictionWindowMode === 3 && !actionArray[1].canUse(skill)) {
                                        // actionの初期化
                                        targetArray[1].clearActions();
                                        // 行動タイミングと攻撃射程の初期化
                                        actionArray[1].setActionTiming(-1);
                                        targetArray[1].setActionTiming(-1);
                                        actionArray[1].clearSrpgRangeListForBattle();
                                        targetArray[1].clearSrpgRangeListForBattle();
                                        // 対象と距離の初期化
                                        $gameTemp.clearTargetEvent();
                                        $gameTemp.setSrpgDistance(0);
                                        // ターゲット選択に戻す
                                        $gameSystem.setSubBattlePhase('actor_target');
                                        return;
                                    } else {
                                        // 戦闘開始ウィンドウに進む
                                        SoundManager.playOk();
                                        $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
                                        if (_srpgPredictionWindowMode !== 3) $gameSystem.setSrpgStatusWindowNeedRefresh(actionArray);
                                        $gameSystem.setSrpgBattleWindowNeedRefresh(actionArray, targetArray);
                                    }
                                }
                            }
                        }
                    });
                }
            }
        } else {
            _SRPG_Game_Player_startMapEvent.call(this, x, y, triggers, normal);
        }
    };

    //戦闘中、隣接するイベントへの起動判定は行わない
    var _SRPG_Game_Player_checkEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;
    Game_Player.prototype.checkEventTriggerThere = function(triggers) {
        if ($gameSystem.isSRPGMode() === false) {
            _SRPG_Game_Player_checkEventTriggerThere.call(this, triggers);
        }
    };

    //戦闘中、接触による起動判定は行わない
    var _SRPG_Game_Player_checkEventTriggerTouch = Game_Player.prototype.checkEventTriggerTouch;
    Game_Player.prototype.checkEventTriggerTouch = function(x, y) {
        if ($gameSystem.isSRPGMode() === false) {
            _SRPG_Game_Player_checkEventTriggerTouch.call(this, x, y);
        }
    };

//====================================================================
// ●Game_Follower
//====================================================================
    //戦闘中、フォロワーが表示されないようにする
    var _SRPG_Game_Follower_refresh = Game_Follower.prototype.refresh;
    Game_Follower.prototype.refresh = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this.setImage('', 0);
        } else {
            _SRPG_Game_Follower_refresh.call(this);
        }
    };

//====================================================================
// ●Game_Event
//====================================================================
    //----------------------------------------------------------------
    // 初期化
    //----------------------------------------------------------------
    var _SRPG_Game_Event_initMembers = Game_Event.prototype.initMembers;
    Game_Event.prototype.initMembers = function() {
        _SRPG_Game_Event_initMembers.call(this);
        this._srpgForceRoute = [];
        this._srpgEventType = '';
    };

    //----------------------------------------------------------------
    // 基本的なパラメータを返す
    //----------------------------------------------------------------
    // イベントかどうかを返す
    Game_Event.prototype.isEvent = function() {
        return true;
    };

    // ページ番号を返す
    Game_Event.prototype.pageIndex = function() {
        return this._pageIndex;
    };

    // 消去済みかどうかを返す
    Game_Event.prototype.isErased = function() {
        return this._erased;
    };

    // 消去済みフラグを消す
    Game_Event.prototype.appear = function() {
        this._erased = false;
        this.refresh();
    };

    //----------------------------------------------------------------
    // ユニットの種類に関わる処理
    //----------------------------------------------------------------
    // ユニットの種別を設定する
    // actor, enemy
    Game_Event.prototype.setType = function(type) {
        this._srpgEventType = type;
    };

    // ユニットの種別を返す
    Game_Event.prototype.isType = function() {
        return this._srpgEventType;
    };

    //----------------------------------------------------------------
    // 画像に関わる処理
    //----------------------------------------------------------------
    // アクター・エネミーデータを元にイベントのグラフィックを変更する＋戦闘以外では元に戻す
    Game_Event.prototype.refreshImage = function() {
        if ($gameSystem.isSRPGMode() === true) {
            var battlerArray = $gameSystem.EventToUnit(this._eventId);
            if (!battlerArray || this.isErased()) return ;
            var type = battlerArray[0];
            var unit = battlerArray[1];
            if (type === 'actor') {
                this.setImage(unit.characterName(), unit.characterIndex());
            } else if (type === 'enemy') {
                var characterName = unit.enemy().meta.characterName;
                var characterIndex = Number(unit.enemy().meta.characterIndex);
                this.setImage(characterName, characterIndex);
            } else if (type === 'null') {
                this.erase();
            }
        } else {
            if (this.isErased()) this.appear();
            var page = this.page();
            if (image) {
                var image = page.image;
                if (image.tileId > 0) {
                    this.setTileImage(image.tileId);
                } else {
                    this.setImage(image.characterName, image.characterIndex);
                }
                this.setDirection(image.direction);
                this.setPattern(image.pattern);
            }
        }
    };

    //----------------------------------------------------------------
    // ユニットの移動に関わる処理
    //----------------------------------------------------------------
    // 移動ルートを設定する
    Game_Event.prototype.srpgMoveRouteForce = function(array) {
        this._srpgForceRoute = [];
        for (var i = 1; i < array.length; i++) {
            this._srpgForceRoute.push(array[i]);
        }
        this._srpgForceRoute.push(0);
    };

    // 設定されたルートに沿って移動する
    var _SRPG_Game_Event_updateStop = Game_Event.prototype.updateStop;
    Game_Event.prototype.updateStop = function() {
        if ($gameSystem.isSRPGMode() === true && this._srpgForceRoute.length > 0) {
            if (!this.isMoving()) {
                var command = this._srpgForceRoute[0];
                this._srpgForceRoute.shift();
                if (command === 0) {
                    this._srpgForceRoute = [];
                    $gameSystem.setSrpgWaitMoving(false);
                } else {
                    this.moveStraight(command);
                }
            }
        } else {
            _SRPG_Game_Event_updateStop.call(this);
        }
    };

//====================================================================
// ●Game_Map
//====================================================================
    //----------------------------------------------------------------
    // 基本的なパラメータを返す
    //----------------------------------------------------------------
    //最大のイベントIDを返す
    Game_Map.prototype.isMaxEventId = function() {
        var maxId = 0;
        this.events().forEach(function(event) {
            if (event.eventId() > maxId) {
                maxId = event.eventId();
            }
        });
        return maxId;
    };

    //----------------------------------------------------------------
    // 画像に関わる処理
    //----------------------------------------------------------------
    //アクター・エネミーデータに合わせてグラフィックを変更する
    Game_Map.prototype.setEventImages = function() {
        this.events().forEach(function(event) {
            event.refreshImage();
        });
    };

    // マップバトルでanimation position === 3（全体）を１度しか再生しないようにする（SRPG_AoE.js併用時）
    // フラグを設定する
    Game_Map.prototype.setMapBattleAnimationFlagPos3 = function(flag) {
        this._mapBattleAnimationFlagPos3 = flag;
    };

    // フラグを返す
    Game_Map.prototype.mapBattleAnimationFlagPos3 = function() {
        return this._mapBattleAnimationFlagPos3;
    };

    //----------------------------------------------------------------
    // イベントの実行に関わる処理
    //----------------------------------------------------------------
    //イベントの実行順序を変更する（実行待ちのイベントを優先する）
    var _SRPG_Game_Map_setupStartingMapEvent = Game_Map.prototype.setupStartingMapEvent;
    Game_Map.prototype.setupStartingMapEvent = function() {
        if ($gameTemp.isSrpgEventList()) {
            var event = $gameTemp.shiftSrpgEventList(); // 実行待ちイベントを順番に取り出す
            if (event.isStarting()) {
                event.clearStartingFlag();
                this._interpreter.setup(event.list(), event.eventId());
                return true;
            }
        }
        return _SRPG_Game_Map_setupStartingMapEvent.call(this); //実行待ちイベントが無くなったら、本来の処理を行う
    };

//====================================================================
// ●Game_Interpreter
//====================================================================
    //----------------------------------------------------------------
    // スイッチ・変数の参照や操作に関するコマンド
    // イベントコマンド→スクリプトで簡便に操作できるように用意している
    //----------------------------------------------------------------
    Game_Interpreter.prototype.s = function(id) {
        return $gameSwitches.value(id);
    };

    Game_Interpreter.prototype.v = function(id) {
        return $gameVariables.value(id);
    };

    Game_Interpreter.prototype.sSet = function(id, value) {
        if (value === true || value === 'ON') {
            $gameSwitches.setValue(id, true);
        } else if (value === false || value === 'OFF') {
            $gameSwitches.setValue(id, false);
        } else {
            $gameSwitches.setValue(id, false);
        }
        return true;
    };

    Game_Interpreter.prototype.vSet = function(id, value) {
        $gameVariables.setValue(id, value);
        return true;
    };

    //----------------------------------------------------------------
    // avtiveEvent, targetEventを返すコマンド（戦闘シーンでの使用を想定）
    // やや慣れた人向け。スクリプト内で簡便に呼び出せるように用意している
    //----------------------------------------------------------------
    // 行動中のイベントのイベントIDを返す
    Game_Interpreter.prototype.activeEventId = function() {
        return $gameTemp.activeEvent().eventId();
    };

    // 行動中のイベントのユニット情報を返す（actor or enemyのbattler情報を返す）
    Game_Interpreter.prototype.activeBattler = function() {
        return $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
    };

    // 対象のイベントのイベントIDを返す
    Game_Interpreter.prototype.targetEventId = function() {
        return $gameTemp.targetEvent().eventId();
    };

    // 対象のイベントのユニット情報を返す（actor or enemyのbattler情報を返す）
    Game_Interpreter.prototype.targetBattler = function() {
        return $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1];
    };

    //----------------------------------------------------------------
    // ユニット間の距離を返すコマンド
    //----------------------------------------------------------------
    // イベントIDをもとに、ユニット間の距離を指定した変数に返す
    Game_Interpreter.prototype.eventEventDistance = function(variableId, eventId1, eventId2) {
        var event1 = $gameMap.event(eventId1);
        var event2 = $gameMap.event(eventId2);
        if (event1 && event2 && !event1.isErased() && !event2.isErased()) {
            var value = $gameSystem.unitDistance(event1, event2);
            $gameVariables.setValue(variableId, value);
        } else {
            $gameVariables.setValue(variableId, 999);
        }
        return true;
    };

    // アクターIDとイベントIDをもとに、ユニット間の距離を指定した変数に返す
    Game_Interpreter.prototype.actorEventDistance = function(variableId, actorId, eventId2) {
        var eventId1 = $gameSystem.ActorToEvent(actorId);
        this.eventEventDistance(variableId, eventId1, eventId2);
        return true;
    };

    // アクターIDをもとに、ユニット間の距離を指定した変数に返す
    Game_Interpreter.prototype.actorActorDistance = function(variableId, actorId1, actorId2) {
        var eventId1 = $gameSystem.ActorToEvent(actorId1);
        var eventId2 = $gameSystem.ActorToEvent(actorId2);
        this.eventEventDistance(variableId, eventId1, eventId2);
        return true;
    };

    // 特定のIDのイベントと全アクターの中で最短の距離を指定した変数に返す
    Game_Interpreter.prototype.fromActorMinimumDistance = function(variableId, eventId) {
        var minDistance = 999;
        var event1 = $gameMap.event(eventId);
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'actor') {
                var event2 = $gameMap.event(event.eventId());
                if (event1 && event2 && !event1.isErased() && !event2.isErased()) {
                    var value = $gameSystem.unitDistance(event1, event2);
                    if (value < minDistance) {
                        minDistance = value;
                    }
                }
            }
        });
        $gameVariables.setValue(variableId, minDistance);
        return true;
    };

    // 指定した２つのイベントIDが、行動中イベントのIDと攻撃対象イベントのID（変数に代入されるものと同じもの）と
    // 一致するかを調べ、スイッチに返す。行動前イベントや戦闘中のイベントでの使用を想定。
    // 例：ID 10 と 20 を調べると、行動中 10, 攻撃対象 20 または行動中 20, 攻撃対象 10 の時にtrueを返す
    Game_Interpreter.prototype.checkUserAndTarget = function(switchId, eventId1, eventId2) {
        if ($gameTemp.activeEvent() && $gameTemp.targetEvent()) {
            if (($gameTemp.activeEvent().eventId() === eventId1 && $gameTemp.targetEvent().eventId() === eventId2) ||
                ($gameTemp.activeEvent().eventId() === eventId2 && $gameTemp.targetEvent().eventId() === eventId1)) {
                    $gameSwitches.setValue(switchId, true);
                } else {
                    $gameSwitches.setValue(switchId, false);
                }
        } else {
            $gameSwitches.setValue(switchId, false);
        }        
        return true;
    };

    // イベントIDをもとに、ユニット間の距離を指定した変数に返す
    // ＊使用を推奨しないが互換性のために残してある
    Game_Interpreter.prototype.EventDistance = function(variableId, eventId1, eventId2) {
        var event1 = $gameMap.event(eventId1);
        var event2 = $gameMap.event(eventId2);
        if (event1 && event2 && !event1.isErased() && !event2.isErased()) {
            var value = $gameSystem.unitDistance(event1, event2);
            $gameVariables.setValue(variableId, value);
        } else {
            $gameVariables.setValue(variableId, 999);
        }
        return true;
    };

    // アクターIDをもとに、ユニット間の距離をとる
    // ＊使用を推奨しないが互換性のために残してある
    Game_Interpreter.prototype.ActorDistance = function(variableId, actorId1, actorId2) {
        var eventId1 = $gameSystem.ActorToEvent(actorId1);
        var eventId2 = $gameSystem.ActorToEvent(actorId2);
        this.EventDistance(variableId, eventId1, eventId2);
        return true;
    };

    //----------------------------------------------------------------
    // ユニットのステータスを返すコマンド
    //----------------------------------------------------------------
    // 上級者向けmemo:イベントIDからユニットの情報を取り出す方法
    // var battlerArray = $gameSystem.EventToUnit(eventId);
    // battlerArray[0] = 'actor' または 'enemy' →そのイベントがユニットかどうか、敵味方どちらかの判定に使う
    // battlerArray[1] = battler →battlerの情報

    // 指定したイベントがアクターかを指定したスイッチに返す
    Game_Interpreter.prototype.isUnitActor = function(switchId, eventId) {
        $gameSwitches.setValue(switchId, false);
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && battlerArray[0] === 'actor') {
            $gameSwitches.setValue(switchId, true);
        }
        return true;
    };

     // 指定したイベントがエネミーかを指定したスイッチに返す
    Game_Interpreter.prototype.isUnitEnemy = function(switchId, eventId) {
        $gameSwitches.setValue(switchId, false);
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && battlerArray[0] === 'enemy') {
            $gameSwitches.setValue(switchId, true);
        }
        return true;
    };

    // 指定したイベントのユニットIDを指定した変数に返す（アクターならアクターID、エネミーならエネミーID）
    Game_Interpreter.prototype.isUnitId = function(variableId, eventId) {
        $gameVariables.setValue(variableId, 0);
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray) {
            if (battlerArray[0] === 'actor') {
                $gameVariables.setValue(variableId, battlerArray[1].actorId());
            } else if (battlerArray[0] === 'enemy') {
                $gameVariables.setValue(variableId, battlerArray[1].enemyId());
            }
        }
        return true;
    };

    // 指定したアクターのイベントIDを指定した変数に返す
    Game_Interpreter.prototype.isEventIdActor = function(variableId, actorId) {
        $gameVariables.setValue(variableId, 0);
        var actor = $gameActors.actor(actorId);
        if (actor && actor.event()) {
            $gameVariables.setValue(variableId, actor.event().eventId());
        }
        return true;
    };

    // 指定したイベントのHPを指定した変数に返す
    // isUnitParamsでも可能だが、HPの取得は頻用するため別に用意してある
    Game_Interpreter.prototype.isUnitHp = function(variableId, eventId) {
        $gameVariables.setValue(variableId, 0);
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            $gameVariables.setValue(variableId, battlerArray[1].hp);
        } else {
            $gameVariables.setValue(variableId, 0);
        }
        return true;
    };

    // 指定したイベントIDのユニットのパラメータを取得する
    // key : 'level''hp''mp''tp''mhp''mmp''atk''def''mat''mdf''agi''luk'
    //       'hit''eva''cri''cev''mev''mrf''cnt''hrg''mrg''trg''tgr''grd'
    //       'rec''pha''mcr''tcr''pdr''mdr''fdr''exr''move''wRange'
    Game_Interpreter.prototype.isUnitParams = function(variableId, eventId, key) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            switch (key) {
                case 'level':
                    $gameVariables.setValue(variableId, battlerArray[1].level);           
                    break;
                case 'hp':
                    $gameVariables.setValue(variableId, battlerArray[1].hp);
                    break;
                case 'mp':
                    $gameVariables.setValue(variableId, battlerArray[1].mp);
                    break;
                case 'tp':
                    $gameVariables.setValue(variableId, battlerArray[1].tp);
                    break;
                case 'mhp':
                    $gameVariables.setValue(variableId, battlerArray[1].mhp);
                    break;
                case 'mmp':
                    $gameVariables.setValue(variableId, battlerArray[1].mmp);
                    break;
                case 'atk':
                    $gameVariables.setValue(variableId, battlerArray[1].atk);
                    break;
                case 'def':
                    $gameVariables.setValue(variableId, battlerArray[1].def);
                    break;
                case 'mat':
                    $gameVariables.setValue(variableId, battlerArray[1].mat);
                    break;
                case 'mdf':
                    $gameVariables.setValue(variableId, battlerArray[1].mdf);
                    break;
                case 'agi':
                    $gameVariables.setValue(variableId, battlerArray[1].agi);
                    break;
                case 'luk':
                    $gameVariables.setValue(variableId, battlerArray[1].luk);
                    break;
                case 'hit':
                    $gameVariables.setValue(variableId, battlerArray[1].hit);
                    break;
                case 'eva':
                    $gameVariables.setValue(variableId, battlerArray[1].eva);
                    break;
                case 'cri':
                    $gameVariables.setValue(variableId, battlerArray[1].cri);
                    break;
                case 'cev':
                    $gameVariables.setValue(variableId, battlerArray[1].cev);
                    break;
                case 'mev':
                    $gameVariables.setValue(variableId, battlerArray[1].mev);
                    break;
                case 'mrf':
                    $gameVariables.setValue(variableId, battlerArray[1].mrf);
                    break;
                case 'cnt':
                    $gameVariables.setValue(variableId, battlerArray[1].cnt);
                    break;
                case 'hrg':
                    $gameVariables.setValue(variableId, battlerArray[1].hrg);
                    break;
                case 'mrg':
                    $gameVariables.setValue(variableId, battlerArray[1].mrg);
                    break;
                case 'trg':
                    $gameVariables.setValue(variableId, battlerArray[1].trg);
                    break;
                case 'tgr':
                    $gameVariables.setValue(variableId, battlerArray[1].tgr);
                    break;
                case 'grd':
                    $gameVariables.setValue(variableId, battlerArray[1].grd);
                    break;
                case 'rec':
                    $gameVariables.setValue(variableId, battlerArray[1].rec);
                    break;
                case 'pha':
                    $gameVariables.setValue(variableId, battlerArray[1].pha);
                    break;
                case 'mcr':
                    $gameVariables.setValue(variableId, battlerArray[1].mcr);
                    break;
                case 'tcr':
                    $gameVariables.setValue(variableId, battlerArray[1].tcr);
                    break;
                case 'pdr':
                    $gameVariables.setValue(variableId, battlerArray[1].pdr);
                    break;
                case 'mdr':
                    $gameVariables.setValue(variableId, battlerArray[1].mdr);
                    break;
                case 'fdr':
                    $gameVariables.setValue(variableId, battlerArray[1].fdr);
                    break;
                case 'exr':
                    $gameVariables.setValue(variableId, battlerArray[1].exr);
                    break;
                case 'move':
                    $gameVariables.setValue(variableId, battlerArray[1].srpgMove());
                    break;
                case 'wRange':
                    $gameVariables.setValue(variableId, battlerArray[1].srpgWeaponRange());
                    break;
                default:
                    $gameVariables.setValue(variableId, 0);
                    break;
            }
        } else {
            $gameVariables.setValue(variableId, 0);
        }
        return true;
    };

    // 指定したイベントが戦闘不能か指定したスイッチに返す
    // isUnitStateAffectedでも可能だが、戦闘不能は頻用するため別に用意している
    Game_Interpreter.prototype.isUnitDead = function(switchId, eventId) {
        $gameSwitches.setValue(switchId, false);
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            $gameSwitches.setValue(switchId, battlerArray[1].isDead());
        }
        return true;
    };

    // 指定したイベントがあるステートになっているか指定したスイッチに返す
    Game_Interpreter.prototype.isUnitStateAffected = function(switchId, eventId, stateId) {
        $gameSwitches.setValue(switchId, false);
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            $gameSwitches.setValue(switchId, battlerArray[1].isStateAffected(stateId));
        }
        return true;
    };

    // アクティブイベントのイベントIDを返す(プラグインパラメータで指定したIDに取得しているものと同じ)
    // 戦闘開始前イベント、もしくは戦闘中のイベントで使用されることを想定
    // 行動中のイベントがいない場合は無効
    Game_Interpreter.prototype.isActiveEventId = function(variableId) {
        $gameVariables.setValue(variableId, 0);
        if ($gameTemp.activeEvent()) {
            $gameVariables.setValue(variableId, $gameTemp.activeEvent().eventId());
        }
        return true;
    };

    // アクティブイベントが選択しているスキルのIDを返す
    // 戦闘開始前イベント、もしくは戦闘中のイベントで使用されることを想定
    // 行動中のイベントがいない場合は無効
    Game_Interpreter.prototype.isActiveEventSkillId = function(variableId) {
        $gameVariables.setValue(variableId, 0);
        if ($gameTemp.activeEvent()) {
            var activeBattler = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
            $gameVariables.setValue(variableId, activeBattler.currentAction().item().id);
        }
        return true;
    };

    // アクティブイベントが移動した歩数を返す（a.movedStep() の形でダメージ計算式でも使用可能）
    // 戦闘開始前イベント、戦闘中のイベント、スキルのコモンイベントで使用されることを想定
    // 行動中のイベントがいない場合は無効
    Game_Interpreter.prototype.isActiveEventMovedStep = function(variableId) {
        $gameVariables.setValue(variableId, 0);
        if ($gameTemp.activeEvent()) {
            var activeBattler = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
            $gameVariables.setValue(variableId, activeBattler.movedStep());
        }
        return true;
    };

    //----------------------------------------------------------------
    // イベントやユニットの座標の取得に関係するコマンド
    //----------------------------------------------------------------
    // 指定した座標のユニットのイベントIDを取得する
    Game_Interpreter.prototype.isEventIdXy = function(variableId, x, y) {
        $gameVariables.setValue(variableId, 0);
        $gameMap.eventsXy(x, y).forEach(function(event) {
            var battlerArray = $gameSystem.EventToUnit(event.eventId());
            if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
                $gameVariables.setValue(variableId, event.eventId());
            }
        });
        return true;
    };

    // 指定したリージョンID上にアクターユニットがいるか判定する
    Game_Interpreter.prototype.checkRegionId = function(switchId, regionId) {
        $gameSwitches.setValue(switchId, false);
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'actor') {
                if ($gameMap.regionId(event.posX(), event.posY()) == regionId) {
                    $gameSwitches.setValue(switchId, true);
                }
            }
        });
    };

    //----------------------------------------------------------------
    // ユニットのステータスを変更するコマンド
    // ユニットの変身は、変身前のユニットの戦闘不能＋変身後のユニットの増援で可能
    //----------------------------------------------------------------
    // 指定したイベントのHP増減（allowDeathはtrue / false）
    Game_Interpreter.prototype.unitGainHp = function(eventId, value, allowDeath) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        var event = $gameMap.event(eventId);
        if (battlerArray && event && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (battlerArray[1].isAlive()) {
                if (!allowDeath && battlerArray[1].hp <= -value) {
                    value = 1 - battlerArray[1].hp;
                }
                battlerArray[1].gainHp(value);
                if (battlerArray[1].isDead()) {
                    if (!event.isErased()) {
                        event.erase();
                        if (battlerArray[0] === 'actor') {
                            var oldValue = $gameVariables.value(_existActorVarID);
                            $gameVariables.setValue(_existActorVarID, oldValue - 1);
                        } else if (battlerArray[0] === 'enemy') {
                            var oldValue = $gameVariables.value(_existEnemyVarID);
                            $gameVariables.setValue(_existEnemyVarID, oldValue - 1);
                        }
                    }
                }
            }
        }
        return true;
    };

    // 指定したイベントのMP増減
    Game_Interpreter.prototype.unitGainMp = function(eventId, value) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (battlerArray[1].isAlive()) battlerArray[1].gainMp(value);
        }
    };

    // 指定したイベントのTP増減
    Game_Interpreter.prototype.unitGainTp = function(eventId, value) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (battlerArray[1].isAlive()) battlerArray[1].gainTp(value);
        }
    };

    // 指定したイベントIDのユニットを全回復する
    Game_Interpreter.prototype.unitRecoverAll = function(eventId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (battlerArray[1].isAlive()) {
                battlerArray[1].recoverAll();
            }
        }
        return true;
    };

    // 指定したイベントIDのユニットを指定したステートにする
    Game_Interpreter.prototype.unitAddState = function(eventId, stateId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        var event = $gameMap.event(eventId);
        if (battlerArray && event && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (battlerArray[1].isAlive()) {
                battlerArray[1].addState(stateId);
                if (battlerArray[1].isDead()) {
                    if (!event.isErased()) {
                        event.erase();
                        if (battlerArray[0] === 'actor') {
                            var oldValue = $gameVariables.value(_existActorVarID);
                            $gameVariables.setValue(_existActorVarID, oldValue - 1);
                        } else if (battlerArray[0] === 'enemy') {
                            var oldValue = $gameVariables.value(_existEnemyVarID);
                            $gameVariables.setValue(_existEnemyVarID, oldValue - 1);
                        }
                    }
                }
            }
            battlerArray[1].clearResult();
        }
        return true;
    };

    // 指定したイベントIDのユニットを復活する
    // unitRemoveStateでも可能だが、戦闘不能からの回復は頻用するため別に用意している
    Game_Interpreter.prototype.unitRevive = function(eventId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        var event = $gameMap.event(eventId);
        if (battlerArray && event && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (battlerArray[1].isAlive()) return;
            battlerArray[1].removeState(battlerArray[1].deathStateId());
            if (battlerArray[0] === 'actor') {
                var oldValue = $gameVariables.value(_existActorVarID);
                $gameVariables.setValue(_existActorVarID, oldValue + 1);
            } else {
                var oldValue = $gameVariables.value(_existEnemyVarID);
                $gameVariables.setValue(_existEnemyVarID, oldValue + 1);
            }
            var xy = event.makeAppearPoint(event, event.posX(), event.posY(), battlerArray[1].srpgThroughTag());
            event.locate(xy[0], xy[1]);
            event.appear();
            $gameMap.setEventImages();
        }
    };

    // 指定したイベントIDのユニットの指定したステートを解除する
    Game_Interpreter.prototype.unitRemoveState = function(eventId, stateId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            if (stateId === battlerArray[1].deathStateId()) {
                this.unitRevive(eventId);
            } else {
                battlerArray[1].removeState(stateId);
                battlerArray[1].clearResult();
            }            
        }
        return true;
    };

    // 指定したイベントの戦闘モードを設定する
    Game_Interpreter.prototype.setBattleMode = function(eventId, mode) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            battlerArray[1].setBattleMode(mode);
        }
        return true;
    };

    // 指定したイベントのターゲットIDを設定する
    // 戦闘モードが'aimingEvent'または'aimingActor'で機能する
    Game_Interpreter.prototype.setTargetId = function(eventId, targetId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            battlerArray[1].setTargetId(targetId);
        }
        return true;
    };

    // 指定したイベントに行動終了フラグを設定する（強制的に行動終了にする）
    // ターン開始時のイベントやプレイヤーイベントでの使用を想定。
    // スキルのコモンイベントでも使用できるが、味方が使用するスキルでしか有用でない。
    Game_Interpreter.prototype.unitTurnEnd = function(eventId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            battlerArray[1].onAllActionsEnd();
            battlerArray[1].useSRPGActionTimes(99);
            battlerArray[1].setSrpgTurnEnd(true);
        }
        return true;
    };

    // アクターターン終了の判定
    Game_Interpreter.prototype.isSrpgActorTurnEnd = function() {
        return $gameMap.events().some(function(event) {
            var battlerArray = $gameSystem.EventToUnit(event._eventId);
            if (battlerArray && battlerArray[0] === 'actor') {
                return battlerArray[1].canInput();
            }
        });
    };

    // 指定したイベントの行動終了フラグを解除する（再行動させる）
    // eventIdに『対象のイベントID（プラグインパラメータで指定したIDに取得しているもの）』を入れて
    // スキルのコモンイベントで使用すると、対象を再行動させるスキルに出来る
    Game_Interpreter.prototype.unitReaction = function(eventId) {
        var battlerArray = $gameSystem.EventToUnit(eventId);
        if (battlerArray && (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy')) {
            battlerArray[1].setSrpgTurnEnd(false);
            battlerArray[1].SRPGActionTimesSet();
        }
        return true;
    };

    //----------------------------------------------------------------
    // ユニットの増援に関係するコマンド
    //----------------------------------------------------------------
    // 新規アクターを追加する（増援）
    Game_Interpreter.prototype.addActor = function(eventId, actorId) {
        var actor_unit = $gameActors.actor(actorId);
        var event = $gameMap.event(eventId);
        if (actor_unit && event) {
            $gameSystem.pushSrpgAllActors(event.eventId());
            actor_unit.initTp(); // TPを初期化
            actor_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
            $gameSystem.preloadFaceGraphic(['actor', actor_unit]); // 顔グラフィックをプリロードする
            var oldValue = $gameVariables.value(_existActorVarID); // 味方の数を１増やす
            $gameVariables.setValue(_existActorVarID, oldValue + 1);
            $gameSystem.setEventToUnit(event.eventId(), 'actor', actor_unit.actorId());
            event.setType('actor');
            var xy = event.makeAppearPoint(event, event.posX(), event.posY(), actor_unit.srpgThroughTag()); // 出現位置の調整
            event.locate(xy[0], xy[1]);
            if (event.isErased()) event.appear(); // 消去済みのイベントだった場合、出現させる
            actor_unit.setSrpgTurnEnd(false); // 行動済フラグを初期化する
            actor_unit.SRPGActionTimesSet();
            $gameMap.setEventImages(); // イベントの画像を設定する
        }
        return true;
    };

    // 新規エネミーを追加する（増援）
    Game_Interpreter.prototype.addEnemy = function(eventId, enemyId) {
        var enemy_unit = new Game_Enemy(enemyId, 0, 0);
        var event = $gameMap.event(eventId);
        if (enemy_unit && event) {
            enemy_unit.initTp(); // TPを初期化
            enemy_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
            $gameSystem.preloadFaceGraphic(['enemy', enemy_unit]); // 顔グラフィックをプリロードする
            var oldValue = $gameVariables.value(_existEnemyVarID); // 敵の数を１増やす
            $gameVariables.setValue(_existEnemyVarID, oldValue + 1);
            $gameSystem.setEventToUnit(event.eventId(), 'enemy', enemy_unit);
            event.setType('enemy');
            var xy = event.makeAppearPoint(event, event.posX(), event.posY(), enemy_unit.srpgThroughTag()); // 出現位置の調整
            event.locate(xy[0], xy[1]);
            if (event.isErased()) event.appear(); // 消去済みのイベントだった場合、出現させる
            enemy_unit.setSrpgTurnEnd(false); // 行動済フラグを初期化する
            enemy_unit.SRPGActionTimesSet();
            $gameMap.setEventImages(); // イベントの画像を設定する
        }
         return true;
    };

    //----------------------------------------------------------------
    // プレイヤーの操作に関係するコマンド
    //----------------------------------------------------------------
    // 指定した座標にプレイヤーを移動する
    Game_Interpreter.prototype.playerMoveTo = function(x, y) {
        $gameTemp.setAutoMoveDestinationValid(true);
        $gameTemp.setAutoMoveDestination(x, y);
        return true;
    };

    // 指定したIDのイベントの座標にプレイヤーを移動する(0 で「このイベント」)
    Game_Interpreter.prototype.playerMoveToEvent = function(eventId) {
        var event = $gameMap.event(eventId > 0 ? eventId : this._eventId);
        if (event) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination(event.posX(), event.posY());
        }
        return true;
    };

    // プレイヤーの操作を受け付けるかの判定（操作できるサブフェーズか？ を判定）
    // ピクチャボタン化プラグインなどとの組み合わせを想定（無差別にイベントが実行されるのを防ぐ）
    Game_Interpreter.prototype.isSubPhaseNormal = function(switchId) {
        if ($gameSystem.isBattlePhase() === 'actor_phase' && $gameSystem.isSubBattlePhase() === 'normal') {
            $gameSwitches.setValue(switchId, true);
        } else {
            $gameSwitches.setValue(switchId, false);
        }
        return true;
    };

    // アクターターン終了を行う（メニューの「ターン終了」と同じ）
    // イベントから実行することで、強制的にターン終了を行える
    // ただし、無差別に実行すると不具合の原因になるので、this.isSubPhaseNormal(switchId)による条件分岐と組み合わせることを推奨
    // 慣れていれば、<type:actorTurn>などと組み合わせることも可能
    Game_Interpreter.prototype.turnEnd = function() {
        $gameTemp.setTurnEndFlag(true);
        return true;
    };

    //----------------------------------------------------------------
    // 勝敗条件の設定に関するコマンド
    // $gameSystem...の定義を直接用いても良いが、統一するためinterpreterでも定義している
    //----------------------------------------------------------------
    // 勝敗条件をクリアする
    Game_Interpreter.prototype.clearWinLoseCondition = function() {
        $gameSystem.clearSrpgWinLoseCondition();
        return true;
    };

    // 勝利条件の文章を設定する（textは''で囲む　例：'敵の全滅'）
    // 複数回実行することで複数行を表示できる
    Game_Interpreter.prototype.setWinCondition = function(text) {
        $gameSystem.setSrpgWinCondition(text);
        return true;
    };

    // 敗北条件の文章を設定する（textは''で囲む　例：'味方の全滅'）
    // 複数回実行することで複数行を表示できる
    Game_Interpreter.prototype.setLoseCondition = function(text) {
        $gameSystem.setSrpgLoseCondition(text);
        return true;
    };

    //----------------------------------------------------------------
    // セルフスイッチの操作に関係するコマンド
    //----------------------------------------------------------------
    // コマンドが実行されたマップに存在するイベントのセルフスイッチをまとめて操作する。
    // 同じマップを繰り返し使用するような場合は、このコマンドでセルフスイッチをクリアすると便利
    // tag:'A', 'B', 'C', 'D', 'all' value:'true''on', 'false''off'
    Game_Interpreter.prototype.mapSelfSwitchesControl = function(tag, value) {
        if (value === 'true' || value === 'on') var flag = true;
        if (value === 'false' || value === 'off') var flag = false;
        $gameMap.events().forEach(function(event) {
            if (tag === 'A' || tag === 'all') {
                var key = [$gameMap.mapId(), event.eventId(), "A"];
                $gameSelfSwitches.setValue(key, flag);
            }
            if (tag === 'B' || tag === 'all') {
                var key = [$gameMap.mapId(), event.eventId(), "B"];
                $gameSelfSwitches.setValue(key, flag);
            }
            if (tag === 'C' || tag === 'all') {
                var key = [$gameMap.mapId(), event.eventId(), "C"];
                $gameSelfSwitches.setValue(key, flag);
            }
            if (tag === 'D' || tag === 'all') {
                var key = [$gameMap.mapId(), event.eventId(), "D"];
                $gameSelfSwitches.setValue(key, flag);
            }
        });
    };

//====================================================================
// ●Sprite_Actor
//====================================================================
    // アクタースプライトの基準位置を設定する
    // YEPプラグインへの対応も行う
    var _SRPG_Sprite_Actor_setActorHome = Sprite_Actor.prototype.setActorHome;
    Sprite_Actor.prototype.setActorHome = function(index) {
        if ($gameSystem.isSRPGMode() === true) {
            if (_AAPwithYEP_BattleEngineCore === 'true') {
                this.setHome(Graphics.width * 3 / 4 - 12 - index * 240, Graphics.height / 2 + 48);
	            this.moveToStartPosition();
	        } else {
                this.setHome(Graphics.width * 3 / 4 - 12 - index * 240, Graphics.height / 2 + 48);
            }
        } else {
            _SRPG_Sprite_Actor_setActorHome.call(this, index);
        }
    };

//====================================================================
// ●Sprite_Character
//====================================================================
    //----------------------------------------------------------------
    // 更新処理
    //----------------------------------------------------------------
    //キャラクタービットマップの更新
    var _SRPG_Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function() {
        _SRPG_Sprite_Character_setCharacterBitmap.call(this);
        this._turnEndBitmap = ImageManager.loadCharacter(_srpgSet);
    };

    // キャラクターフレームの更新
    var _SRPG_Sprite_Character_updateCharacterFrame = Sprite_Character.prototype.updateCharacterFrame;
    Sprite_Character.prototype.updateCharacterFrame = function() {
        _SRPG_Sprite_Character_updateCharacterFrame.call(this);
        if ($gameSystem.isSRPGMode() === true && this._character.isEvent() === true && !this._character.isErased()) {
            var battlerArray = $gameSystem.EventToUnit(this._character.eventId());
            if (battlerArray) {
                var pw = this._turnEndBitmap.width / 12;
                var ph = this._turnEndBitmap.height / 8;
                if ((battlerArray[0] === 'actor' || battlerArray[0] === 'enemy') &&
                    battlerArray[1].isAlive()) {
                    if (battlerArray[1].isRestricted()) { // 行動できない場合
                        var sx = (6 + this.characterPatternX()) * pw;
                        var sy = (0 + this.characterPatternY()) * ph;
                        this.createTurnEndSprites();
                        this.turnEndSpritesSetBitmap(sx, sy, pw, ph);
                    } else if (this.isTurnEndUnit() == true) { // 行動終了している場合
                        var sx = (3 + this.characterPatternX()) * pw;
                        var sy = (0 + this.characterPatternY()) * ph;
                        this.createTurnEndSprites();
                        this.turnEndSpritesSetBitmap(sx, sy, pw, ph);
                    } else if (battlerArray[1].isAutoBattle()) { // 自動戦闘の場合
                        var sx = (9 + this.characterPatternX()) * pw;
                        var sy = (0 + this.characterPatternY()) * ph;
                        this.createTurnEndSprites();
                        this.turnEndSpritesSetBitmap(sx, sy, pw, ph);
                    } else if (this._turnEndSprite) {
                        this._turnEndSprite.visible = false;
                    }
                } else if (this._turnEndSprite) {
                    this._turnEndSprite.visible = false;
                }
            }
        } else if (this._turnEndSprite) {
            this.removeChild(this._turnEndSprite);
            this._turnEndSprite = null;
        }
    };

    //----------------------------------------------------------------
    // ターン終了などキャラクターに重ねて表示する画像の処理
    //----------------------------------------------------------------
    // ターン終了したユニットか返す
    Sprite_Character.prototype.isTurnEndUnit = function() {
        if (this._character.isEvent() === true) {
            var battlerArray = $gameSystem.EventToUnit(this._character.eventId());
            if (battlerArray) {
                if (battlerArray[0] === 'actor' || battlerArray[0] === 'enemy') {
                    return battlerArray[1].srpgTurnEnd();
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    // ターン終了の表示を作る
    // 同じ方法で行動不能・自動行動の表示も作っている
    Sprite_Character.prototype.createTurnEndSprites = function() {
        if (!this._turnEndSprite) {
            this._turnEndSprite = new Sprite();
            this._turnEndSprite.anchor.x = 0.5;
            this._turnEndSprite.anchor.y = 1;
            this.addChild(this._turnEndSprite);
        }
    };

    Sprite_Character.prototype.turnEndSpritesSetBitmap = function(sx, sy, pw, ph) {
        this._turnEndSprite.bitmap = this._turnEndBitmap;
        this._turnEndSprite.visible = true;
        this._turnEndSprite.setFrame(sx, sy, pw, ph);
    };

//====================================================================
// ●Sprite_SrpgMoveTile
//====================================================================
    //----------------------------------------------------------------
    // 移動範囲の表示に使うスプライトの作成
    //----------------------------------------------------------------
    // 初期化
    Sprite_SrpgMoveTile.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.createBitmap();
        this._frameCount = 0;
        this._posX = -1;
        this._posY = -1;
        this.z = 0;
        this.visible = false;
    };

    // タイルの座標が有効か返す
    Sprite_SrpgMoveTile.prototype.isThisMoveTileValid = function() {
        return this._posX >= 0 && this._posY >= 0;
    }

    // 表示するタイルをセットする
    Sprite_SrpgMoveTile.prototype.setThisMoveTile = function(x, y, attackFlag) {
        this._frameCount = 0;
        this._posX = x;
        this._posY = y;
        if (attackFlag === true) {
            this.bitmap.fillAll('red');
        } else {
            this.bitmap.fillAll('blue');
        }    
    }

    // 表示するタイルをクリアする
    Sprite_SrpgMoveTile.prototype.clearThisMoveTile = function() {
        this._frameCount = 0;
        this._posX = -1;
        this._posY = -1;
    }

    // 画像の作成
    Sprite_SrpgMoveTile.prototype.createBitmap = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        this.bitmap = new Bitmap(tileWidth, tileHeight);
        this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.blendMode = 1;
    };

    // 更新
    Sprite_SrpgMoveTile.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if (this.isThisMoveTileValid()){
            this.updatePosition();
            this.updateAnimation();
            this.visible = true;
        } else {
            this.visible = false;
        }
    };

    // 表示位置の更新
    Sprite_SrpgMoveTile.prototype.updatePosition = function() {
        var tileWidth = $gameMap.tileWidth();
        var tileHeight = $gameMap.tileHeight();
        this.x = ($gameMap.adjustX(this._posX) + 0.5) * tileWidth;
        this.y = ($gameMap.adjustY(this._posY) + 0.5) * tileHeight;
    };

    // アニメーションの更新
    Sprite_SrpgMoveTile.prototype.updateAnimation = function() {
        this._frameCount++;
        this._frameCount %= 40;
        this.opacity = (40 - this._frameCount) * 3;
    };

//====================================================================
// ●Sprite_Gauge
//====================================================================
    //----------------------------------------------------------------
    // ゲージの有効化
    //----------------------------------------------------------------
    const _SRPG_Sprite_Gauge_isValid = Sprite_Gauge.prototype.isValid;
    Sprite_Gauge.prototype.isValid = function() {
        if ($gameSystem.isSRPGMode()){
            if (this._battler) {
                if (this._statusType === "exp" && this._battler.isEnemy() === true) {
                    return false;
                } else {
                    return true;
                }
            }
        } else {
            return _SRPG_Sprite_Gauge_isValid.call(this);
        }
    };

    //----------------------------------------------------------------
    // EXPゲージの追加
    //----------------------------------------------------------------
    const _SRPG_Sprite_Gauge_currentValue = Sprite_Gauge.prototype.currentValue;
    Sprite_Gauge.prototype.currentValue = function() {
        if (this._battler) {
            if (this._battler.isActor() === true && this._statusType === "exp") {
                return this._battler.currentExp() - this._battler.currentLevelExp();
            }
        }
        return _SRPG_Sprite_Gauge_currentValue.call(this);
    };
    
    const _SRPG_Sprite_Gauge_currentMaxValue = Sprite_Gauge.prototype.currentMaxValue;
    Sprite_Gauge.prototype.currentMaxValue = function() {
        if (this._battler) {
            if (this._battler.isActor() === true && this._statusType === "exp") {
                return this._battler.nextLevelExp() - this._battler.currentLevelExp();
            }
        }
        return _SRPG_Sprite_Gauge_currentMaxValue.call(this);
    };
    
    const _SRPG_Sprite_Gauge_label = Sprite_Gauge.prototype.label;
    Sprite_Gauge.prototype.label = function() {
        if (this._battler) {
            if (this._battler.isActor() === true && this._statusType === "exp") {
                return TextManager.levelA;
            }
        }
        return _SRPG_Sprite_Gauge_label.call(this);
    };

    const _SRPG_Sprite_Gauge_gaugeColor1 = Sprite_Gauge.prototype.gaugeColor1;
    Sprite_Gauge.prototype.gaugeColor1 = function() {
        if (this._battler) {
            if (this._battler.isActor() === true && this._statusType === "exp") {
                return ColorManager.ctGaugeColor1();
            }
        }
        return _SRPG_Sprite_Gauge_gaugeColor1.call(this);
    };
    
    const _SRPG_Sprite_Gauge_gaugeColor2 = Sprite_Gauge.prototype.gaugeColor2;
    Sprite_Gauge.prototype.gaugeColor2 = function() {
        if (this._battler) {
            if (this._battler.isActor() === true && this._statusType === "exp") {
                return ColorManager.ctGaugeColor2();
            }
        }
        return _SRPG_Sprite_Gauge_gaugeColor2.call(this);
    };

    const _SRPG_Sprite_Gauge_drawValue = Sprite_Gauge.prototype.drawValue;
    Sprite_Gauge.prototype.drawValue = function() {
        if (this._statusType === "exp") {
            const currentValue = this._battler.level;
            const width = this.bitmapWidth();
            const height = this.bitmapHeight();
            this.setupValueFont();
            this.bitmap.drawText(currentValue, 36, 0, width - 32, height - 6, "left");
        } else {
            _SRPG_Sprite_Gauge_drawValue.call(this);
        }
    };

//====================================================================
// ●Spriteset_Map
//====================================================================
    //----------------------------------------------------------------
    // 移動範囲の表示に使うスプライトに関わる処理
    //----------------------------------------------------------------
    // 作成
    const _SRPG_Spriteset_Map_createTilemap = Spriteset_Map.prototype.createTilemap;
    Spriteset_Map.prototype.createTilemap = function() {
        _SRPG_Spriteset_Map_createTilemap.call(this);
        this._srpgMoveTile = [];
        for (var i = 0; i < $gameSystem.spriteMoveTileMax(); i++) {
            this._srpgMoveTile[i] = new Sprite_SrpgMoveTile();
            this._tilemap.addChild(this._srpgMoveTile[i]);
        }
    };

    // 更新
    const _SRPG_Spriteset_Map_update = Spriteset_Map.prototype.update;
    Spriteset_Map.prototype.update = function() {
        _SRPG_Spriteset_Map_update.call(this);
        this.updateSrpgMoveTile();
    };

    Spriteset_Map.prototype.updateSrpgMoveTile = function() {
        if ($gameTemp.resetMoveList() === true) {
            for (var i = 0; i < $gameSystem.spriteMoveTileMax(); i++) {
                this._srpgMoveTile[i].clearThisMoveTile();
            }
            $gameTemp.setResetMoveList(false);
        }
        if ($gameTemp.isMoveListValid()) {
            if (!this._srpgMoveTile[0].isThisMoveTileValid()) {
                var list = $gameTemp.moveList();
                for (var i = 0; i < list.length; i++) {
                    var pos = list[i];
                    this._srpgMoveTile[i].setThisMoveTile(pos[0], pos[1], pos[2]);
                }
            }
        } else {
            if (this._srpgMoveTile[0].isThisMoveTileValid()) {
                for (var i = 0; i < $gameSystem.spriteMoveTileMax(); i++) {
                    this._srpgMoveTile[i].clearThisMoveTile();
                }
            }
        }
    };

//====================================================================
// ●Window_StatusBase
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で使用する
    //----------------------------------------------------------------
    // アクターのレベルを描画する
    Window_StatusBase.prototype.drawActorLevel = function(actor, x, y) {
        if ($gameSystem.isSRPGMode()) {
            this.placeGaugeSrpg(actor, "exp", x, y);
        } else {
            this.placeGauge(actor, "exp", x, y);
        }
    };

    // アクターの装備（武器）を描画する
    Window_StatusBase.prototype.drawActorSrpgEqiup = function(actor, x, y) {
        var weapon = actor.weapons()[0]
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(_textSrpgEquip, x, y, 92);
        this.resetTextColor();
        if (actor.isEquipValid(weapon)) {
            this.drawItemName(weapon, x + 96, y, 240);
        } else {
            this.drawText(_textSrpgNone, x + 96, y, 240);
        }
    };

    // エネミーの顔グラフィックを描画する
    Window_StatusBase.prototype.drawEnemyFace = function(enemy, x, y, width, height) {
        var faceName = enemy.enemy().meta.faceName;
        var faceIndex = Number(enemy.enemy().meta.faceIndex);
        if (!faceName) {
            this.drawEnemyFaceWhenNoFace(enemy, x, y, width, height);
        } else {
            this.drawFace(faceName, faceIndex, x, y, width, height);
        }
    };

    // エネミーで顔グラフィックのファイルが指定されていない場合
    // エネミーグラフィックの一部を切り出して顔グラフィックとして使用する
    Window_StatusBase.prototype.drawEnemyFaceWhenNoFace = function(enemy, x, y, width, height) {
        width = width || ImageManager.faceWidth;
        height = height || ImageManager.faceHeight;
        if ($gameSystem.isSideView()) {
            var bitmap = ImageManager.loadSvEnemy(enemy.battlerName());
        } else {
            var bitmap = ImageManager.loadEnemy(enemy.battlerName());
        }
        var pw = ImageManager.faceWidth;
        var ph = ImageManager.faceHeight;
        var sw = Math.min(width, pw, bitmap.width);
        var sh = Math.min(height, ph, bitmap.height);
        var dx = Math.floor(x + Math.max(width - bitmap.width, 0) / 2);
        var dy = Math.floor(y + Math.max(height - bitmap.height, 0) / 2);
        var sx = Math.floor(Math.max(bitmap.width / 2 - width / 2, 0));
        var sy = Math.floor(Math.max(bitmap.height / 2 - height / 2, 0));
        this.contents.blt(bitmap, sx, sy, sw, sh, dx, dy);
    };

    // エネミーのレベルを描画する
    Window_StatusBase.prototype.drawEnemyLevel = function(enemy, x, y) {
        if (enemy.level > 0) {
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.levelA, x, y, 48);
            this.resetTextColor();
            this.drawText(enemy.level, x + 64, y, 42);
        }
    };

    // エネミーの職業（クラス）を描画する
    Window_StatusBase.prototype.drawEnemyClass = function(enemy, x, y, width) {
        width = width || 168;
        var className = enemy.enemy().meta.srpgClass;
        if (!className) {
            className = _enemyDefaultClass;
        }
        this.resetTextColor();
        this.drawText(className, x, y, width);
    };

    // エネミーの装備（武器）を描画する
    Window_StatusBase.prototype.drawEnemySrpgEqiup = function(enemy, x, y) {
        var weapon = $dataWeapons[Number(enemy.enemy().meta.srpgWeapon)];
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(_textSrpgEquip, x, y, 92);
        this.resetTextColor();
        if (enemy.isEquipValid(weapon)) {
            this.drawItemName(weapon, x + 96, y, 240);
        } else {
            this.drawText(_textSrpgNone, x + 96, y, 240);
        }
    };

    //----------------------------------------------------------------
    // SRPG戦闘で使用するゲージ
    //----------------------------------------------------------------
    // ゲージの描画
    Window_StatusBase.prototype.drawGauge = function(x, y, width, rate, color1, color2) {
        var fillW = Math.floor(width * rate);
        var gaugeY = y + this.lineHeight() - 8;
        this.contents.fillRect(x, gaugeY, width, 6, ColorManager.gaugeBackColor());
        this.contents.gradientFillRect(x, gaugeY, fillW, 6, color1, color2);
    };

    // アイコンの描画(sprite)
    Window_StatusBase.prototype.placeStateIconSrpg = function(battler, x, y) {
        const key = "event%1-stateIcon".format(battler.srpgEventId());
        const sprite = this.createInnerSprite(key, Sprite_StateIcon);
        sprite.setup(battler);
        sprite.move(x, y);
        sprite.show();
    };

    // ゲージの描画(sprite)
    Window_StatusBase.prototype.placeGaugeSrpg = function(battler, type, x, y) {
        const key = "event%1-gauge-%2".format(battler.srpgEventId(), type);
        const sprite = this.createInnerSprite(key, Sprite_Gauge);
        sprite.setup(battler, type);
        sprite.move(x, y);
        sprite.show();
    };
    
    Window_StatusBase.prototype.placeBasicGaugesSrpg = function(battler, x, y) {
        this.placeGaugeSrpg(battler, "hp", x, y);
        this.placeGaugeSrpg(battler, "mp", x, y + this.gaugeLineHeight());
        if ($dataSystem.optDisplayTp) {
            this.placeGaugeSrpg(battler, "tp", x, y + this.gaugeLineHeight() * 2);
        }
    };

    Window_StatusBase.prototype.drawActorSimpleStatusSrpg = function(actor, x, y) {
        const lineHeight = this.lineHeight();
        const x2 = x + 180;
        this.drawActorName(actor, x, y);
        this.drawActorLevel(actor, x, y + lineHeight * 1);
        this.drawActorIcons(actor, x, y + lineHeight * 2);
        this.drawActorClass(actor, x2, y);
        this.placeBasicGaugesSrpg(actor, x2, y + lineHeight);
    };

//====================================================================
// ●Window_SrpgStatus
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で使用するステータスウィンドウ
    //----------------------------------------------------------------
    // 初期化
    Window_SrpgStatus.prototype.initialize = function(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._type = null;
        this._battler = null;
        this.refresh();
    };

    // ユニットのセット
    Window_SrpgStatus.prototype.setBattler = function(data, flip) {
        this._type = data[0];
        this._battler = data[1];
        this._flip = flip;
        this.refresh();
    };

    // ユニットのクリア
    Window_SrpgStatus.prototype.clearBattler = function() {
        this._type = null;
        this._battler = null;
        this.refresh();
    };

    // リフレッシュ
    Window_SrpgStatus.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._battler) {
            if (this._type === 'actor') {
                this.drawContentsActor();
            } else if (this._type === 'enemy') {
                this.drawContentsEnemy();
            }
        }
    };

    // アクターのステータスの描画
    Window_SrpgStatus.prototype.drawContentsActor = function() {
        var lineHeight = this.lineHeight();
        this.drawActorName(this._battler, 6, lineHeight * 0);
        this.drawActorClass(this._battler, 192, lineHeight * 0);
        if (this._flip) {
            this.drawActorFace(this._battler, 6, lineHeight * 1);
            this.drawBasicInfoActor(176, lineHeight * 1);
        } else {
            this.drawActorFace(this._battler, 220, lineHeight * 1);
            this.drawBasicInfoActor(6, lineHeight * 1);
        }
        this.drawActorSrpgEqiup(this._battler, 6, lineHeight * 5);
        this.drawParameters(6, lineHeight * 6);
        this.drawSrpgParameters(6, lineHeight * 9);
    };

    // エネミーのステータスの描画
    Window_SrpgStatus.prototype.drawContentsEnemy = function() {
        var lineHeight = this.lineHeight();
        this.drawActorName(this._battler, 6, lineHeight * 0);
        this.drawEnemyClass(this._battler, 192, lineHeight * 0);
        if (this._flip) {
            this.drawEnemyFace(this._battler, 6, lineHeight * 1);
            this.drawBasicInfoEnemy(176, lineHeight * 1);
        } else {
            this.drawEnemyFace(this._battler, 220, lineHeight * 1);
            this.drawBasicInfoEnemy(6, lineHeight * 1);
        }
        this.drawEnemySrpgEqiup(this._battler, 6, lineHeight * 5);
        this.drawParameters(6, lineHeight * 6);
        this.drawSrpgParameters(6, lineHeight * 9);
    };

    // アクターのLv, EXP, ステート、HP, MP, TPの描画
    Window_SrpgStatus.prototype.drawBasicInfoActor = function(x, y) {
        var lineHeight = this.lineHeight();
        this.drawActorLevel(this._battler, x, y + lineHeight * 0);
        this.drawActorIcons(this._battler, x, y + lineHeight * 1);
        this.placeBasicGaugesSrpg(this._battler, x, y + lineHeight * 2);
    };

    // エネミーのLv, ステート、HP, MP, TPの描画
    Window_SrpgStatus.prototype.drawBasicInfoEnemy = function(x, y) {
        var lineHeight = this.lineHeight();
        this.drawEnemyLevel(this._battler, x, y + lineHeight * 0);
        this.drawActorIcons(this._battler, x, y + lineHeight * 1);
        this.placeBasicGaugesSrpg(this._battler, x, y + lineHeight * 2);
    };

    // 攻撃力などパラメータの描画
    Window_SrpgStatus.prototype.drawParameters = function(x, y) {
        var lineHeight = this.lineHeight();
        for (var i = 0; i < 6; i++) {
            var paramId = i + 2;
            var x2 = x + 188 * (i % 2);
            var y2 = y + lineHeight * Math.floor(i / 2);
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.param(paramId), x2, y2, 120);
            this.resetTextColor();
            this.drawText(this._battler.param(paramId), x2 + 120, y2, 48, 'right');
        }
    };

    // 移動力と武器射程の描画
    Window_SrpgStatus.prototype.drawSrpgParameters = function(x, y) {
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(_textSrpgMove, x, y, 120);
        this.resetTextColor();
        this.drawText(this._battler.srpgMove(), x + 120, y, 48, 'right');
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(_textSrpgRange, x + 188, y, 120);
        this.resetTextColor();
        var text = '';
        if (this._battler.srpgWeaponMinRange() > 0) {
            text += this._battler.srpgWeaponMinRange() + '-';
        }
        text += this._battler.srpgWeaponRange();
        this.drawText(text, x + 188 + 72, y, 96, 'right');
    };

//====================================================================
// ●Window_SrpgActorCommandStatus
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘でユニットが行動中に表示されるステータスウィンドウ
    //----------------------------------------------------------------
    // 初期化
    Window_SrpgActorCommandStatus.prototype.initialize = function(rect) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._battler = null;
        this.refresh();
    };

    // ユニットのセット
    Window_SrpgActorCommandStatus.prototype.setBattler = function(battler) {
        this._battler = battler;
        this.refresh();
        this.open();
    };

    // ユニットのクリア
    Window_SrpgActorCommandStatus.prototype.clearBattler = function() {
        this._battler = null;
        this.refresh();
        this.close();
    };

    // リフレッシュ
    Window_SrpgActorCommandStatus.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._battler) {
            this.drawItem();
        }
    };

    // ステータスの描画
    Window_SrpgActorCommandStatus.prototype.drawItem = function() {
        this.drawItemImage();
        this.drawItemStatus();
    };
    
    Window_SrpgActorCommandStatus.prototype.drawItemImage = function() {
        const width = ImageManager.faceWidth;
        const height = this.fittingHeight(2) - 8;
        this.drawActorFace(this._battler, 1, 1, width, height);
    };
    
    Window_SrpgActorCommandStatus.prototype.drawItemStatus = function() {
        const x = 180;
        const y = 0;
        this.drawActorSimpleStatusSrpg(this._battler, x, y);
    };

//====================================================================
// ●Window_MenuActor
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で、戦闘不能スキル・アイテム使用時に使うアクター一覧ウィンドウ
    //----------------------------------------------------------------
    const _SRPG_Window_MenuActor_initialize = Window_MenuActor.prototype.initialize;
    Window_MenuActor.prototype.initialize = function(rect) {
        _SRPG_Window_MenuActor_initialize.call(this, rect);
        this._setBack = 'null';
    };

    Window_MenuActor.prototype.setBack = function(setBack) {
        this._setBack = setBack;
    };

    Window_MenuActor.prototype.backWindow = function() {
        return this._setBack;
    };

//====================================================================
// ●Window_SrpgBattleStatus
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で、戦闘シーンで表示されるステータスウィンドウ
    //----------------------------------------------------------------
    // 初期化
    Window_SrpgBattleStatus.prototype.initialize = function(rect, pos) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this._type = null;
        this._battler = null;
        this._pos = pos;
        this.openness = 255;
        this.refresh();
    };

    // アイコンの座標
    Window_SrpgBattleStatus.prototype.stateIconX = function(x) {
        return x + ImageManager.iconWidth / 2 + 4;
    };
    
    Window_SrpgBattleStatus.prototype.stateIconY = function(y) {
        return y + ImageManager.iconHeight / 2 + 4;
    };

    // 更新
    Window_SrpgBattleStatus.prototype.update = function() {
        Window_StatusBase.prototype.update.call(this);
        if ($gameTemp.isBattleRefreshRequested()) {
            this.preparePartyRefresh();
        }
    };

    // ユニットのセット
    Window_SrpgBattleStatus.prototype.setBattler = function(battler) {
        if (battler.isActor() === true) {
            this._type = 'actor';
        } else if (battler.isEnemy() === true) {
            this._type = 'enemy';
        }
        this._battler = battler;
        this.refresh();
    };

    // リフレッシュ
    Window_SrpgBattleStatus.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (!this._battler) return;
        if (this._type === 'actor') {
            this.drawContentsActor();
        } else if (this._type === 'enemy') {
            this.drawContentsEnemy();
        }
    };

    // アクターのステータスを描画する
    Window_SrpgBattleStatus.prototype.drawContentsActor = function() {
        var lineHeight = this.lineHeight();
        if (this._pos === 0) {
            this.drawActorFace(this._battler, 6, lineHeight * 0);
            this.drawActorName(this._battler, 176, lineHeight * 0);
            this.drawBasicInfo(176, lineHeight * 1);
        } else {
            this.drawActorFace(this._battler, 220, lineHeight * 0);
            this.drawActorName(this._battler, 6, lineHeight * 0);
            this.drawBasicInfo(6, lineHeight * 1);
        }
    };

    // エネミーのステータスを描画する
    Window_SrpgBattleStatus.prototype.drawContentsEnemy = function() {
        var lineHeight = this.lineHeight();
        if (this._pos === 0) {
            this.drawEnemyFace(this._battler, 6, lineHeight * 0);
            this.drawActorName(this._battler, 176, lineHeight * 0);
            this.drawBasicInfo(176, lineHeight * 1);
        } else {
            this.drawEnemyFace(this._battler, 220, lineHeight * 0);
            this.drawActorName(this._battler, 6, lineHeight * 0);
            this.drawBasicInfo(6, lineHeight * 1);
        }
    };

    // アクター・エネミーのステートアイコン、HP,MP,TPを描画する
    Window_SrpgBattleStatus.prototype.drawBasicInfo = function(x, y) {
        var lineHeight = this.lineHeight();
        this.placeStateIconSrpg(this._battler, this.stateIconX(x), this.stateIconY(y));
        this.placeBasicGaugesSrpg(this._battler, x, y + lineHeight * 1);
    };

//====================================================================
// ●Window_SrpgBattleResult
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で、戦闘シーンが終了するときに表示されるリザルトウィンドウ
    //----------------------------------------------------------------
    // 初期化
	// properly initialize, even without a battler
	Window_SrpgBattleResult.prototype.initialize = function(rect, battler) {
        Window_StatusBase.prototype.initialize.call(this, rect);
        this.setBattler(battler);
        this._rewards = null;
        this._changeExp = 0;
	};

	// update the battler between showings of the window
	Window_SrpgBattleResult.prototype.setBattler = function(battler) {
		this._battler = battler;
		if (battler) {
			this._reserveExp = this._battler.currentExp();
			this._level = this._battler.level;
		} else {
			this._reserveExp = 0;
			this._level = 0;
		}
	};

    // EXPの描画処理中かを返す
    Window_SrpgBattleResult.prototype.isChangeExp = function() {
        return this._changeExp > 0;
    };

    // 更新
    Window_SrpgBattleResult.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.updateData();
    };

    // EXPのバーを滑らかに表示するための更新
    Window_SrpgBattleResult.prototype.updateData = function() {
        if (!this._battler) return;
        if (this._changeExp > 0) {
            this.refresh();
            this._changeExp -= 1;
        }
    };

    // 報酬のセット
    Window_SrpgBattleResult.prototype.setRewards = function(rewards) {
        this._rewards = rewards;
        this._changeExp = 30;
    };

    // リフレッシュ
    Window_SrpgBattleResult.prototype.refresh = function() {
        Window_StatusBase.prototype.refresh.call(this);
        if (this._battler) this.drawContents();
    };

    // 内容の描画
    Window_SrpgBattleResult.prototype.drawContents = function() {
        var lineHeight = this.lineHeight();
        this.drawGainExp(6, lineHeight * 0);
        this.drawGainGold(6, lineHeight * 2);
        this.drawGainItem(0, lineHeight * 3);
    };

    // 獲得EXPの描画（なめらかなバーの描画に対応）
    Window_SrpgBattleResult.prototype.drawGainExp = function(x, y) {
        var lineHeight = this.lineHeight();
        var exp = Math.round(this._rewards.exp * $gameParty.battleMembers()[0].finalExpRate());
        var width = this.innerWidth - this.padding * 2;
        if (exp > 0) {
            var text = TextManager.obtainExp.format(exp, TextManager.exp);
            this.resetTextColor();
            this.drawText(text, x, y, width);
        } else {
            this._changeExp = 1;
        }
        var color1 = ColorManager.hpGaugeColor1();
        var color2 = ColorManager.hpGaugeColor2();
        var nowExp = Math.floor(this._reserveExp + exp / 30 * (31 - this._changeExp));
        if (nowExp >= this._battler.expForLevel(this._level + 1)) {
            this._level += 1;
            var se = {};
            se.name = _expSe;
            se.pan = 0;
            se.pitch = 100;
            se.volume = 90;
            AudioManager.playSe(se);
        }
        if (this._level >= this._battler.maxLevel()) {
            var rate = 1.0;
            var nextExp = '-------'
        } else {
            var rate = (nowExp - this._battler.expForLevel(this._level)) / 
                       (this._battler.expForLevel(this._level + 1) - this._battler.expForLevel(this._level));
            var nextExp = this._battler.expForLevel(this._level + 1) - nowExp;
        }
        this.drawGauge(x + 100, y + lineHeight, width - 100, rate, color1, color2);
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.levelA, x, y + lineHeight, 48);
        this.resetTextColor();
        this.drawText(this._level, x + 48, y + lineHeight, 36, 'right');
        var expNext = TextManager.expNext.format(TextManager.level);
        this.drawText(expNext, width - 270, y + lineHeight, 270);
        this.drawText(nextExp, width - 270, y + lineHeight, 270, 'right');
        this._changeExp -= 1;
    };

    // 獲得お金の描画
    Window_SrpgBattleResult.prototype.drawGainGold = function(x, y) {
        var gold = this._rewards.gold;
        var width = (this.innerWidth - this.padding * 2) / 2;
        if (gold > 0) {
            var unitWidth = Math.min(80, this.textWidth(TextManager.currencyUnit));
            this.resetTextColor();
            this.drawText(gold, x, y, width - unitWidth - 6);
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(TextManager.currencyUnit, x + this.textWidth(gold) + 6, y, unitWidth);
        }
    }

    // 獲得アイテムの描画
    Window_SrpgBattleResult.prototype.drawGainItem = function(x, y) {
        var items = this._rewards.items;
        if (items.length > 1) {
            var width = (this.innerWidth - this.padding * 2) / 2;
        } else {
            var width = this.innerWidth - this.padding * 2;
        }
        if (items.length > 0) {
            for (var i = 0; i < items.length; i++) {
                this.drawItemName(items[i], x + width * Math.floor(0.5 + i * 0.5), y - this.lineHeight() * (i % 2), width);
            }
        }
    }

//====================================================================
// ●Window_SrpgPrediction
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で、戦闘結果の予測を表示するウィンドウ
    //----------------------------------------------------------------
    // 初期化
    Window_SrpgPrediction.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this._actionArray = [];
        this._targetArray = [];
        this.refresh();
    };

    // ユニットのセット（攻撃側と迎撃側を同時に処理する）
    Window_SrpgPrediction.prototype.setBattler = function(data1, data2) {
        this._actionArray = data1;
        this._targetArray = data2;
        this.refresh();
    };

    // ユニットのクリア
    Window_SrpgPrediction.prototype.clearBattler = function() {
        this._actionArray = [];
        this._targetArray = [];
        this.refresh();
    };

    // リフレッシュ
    Window_SrpgPrediction.prototype.refresh = function() {
        this.contents.clear();
        if (!this._actionArray[1] || !this._targetArray[1]) {
          return;
        }
        this.drawContents();
    };

    // スキルが使用可能か返す
    Window_SrpgPrediction.prototype.isEnabled = function(actor, item) {
        return actor && actor.canUse(item);
    };

    // 二回行動の確率を計算する
    Window_SrpgPrediction.prototype.setDoubleActionRate = function(user, target) {
        var agilityRate = 0;
        if (!user.currentAction() || !user.currentAction().item() || user.agi <= target.agi) {
            return agilityRate;
        }
        if (user.currentAction().isForOpponent() &&
            user.currentAction().item().meta.doubleAction !== 'false') {
            var dif = user.agi - target.agi;
            var difMax = target.agi * _srpgAgilityAffectsRatio - target.agi;
            if (difMax === 0) {
                agilityRate = 100;
            } else {
                agilityRate = dif / difMax * 100;
            }
        }
        if (agilityRate > 100) agilityRate = 100;
        return Math.floor(agilityRate);
    };

    // 内容を描画する
    Window_SrpgPrediction.prototype.drawContents = function() {
        this.resetFontSettings();
        var lineHeight = this.lineHeight();
        var padding = 24;
        var user = this._actionArray[1];
        var target = this._targetArray[1];
        // 攻撃側
        var action = user.currentAction();
        var damage = action.srpgPredictionDamage(target);
        var hit = action.itemHit(target);
        var eva = action.itemEva(target);
        this.drawSrpgBattleActionName(user, action, this.innerWidth / 2 + padding * 2, lineHeight * 0, true);
        this.drawSrpgBattleHit(hit, eva, this.innerWidth / 2 + padding * 2, lineHeight * 1);
        this.drawSrpgBattleDistance(user, action, this.innerWidth / 2 + 172 + padding * 2, lineHeight * 1);
        this.drawSrpgBattleDamage(damage, this.innerWidth / 2 + padding * 2, lineHeight * 2, doubleActionRate);
        // 迎撃側
        var reaction = target.currentAction();
        // スキルが使えない or 攻撃側が応戦不能の攻撃の場合
        if (reaction && (!target.canUse(reaction.item()) || user.currentAction().item().meta.srpgUncounterable)) {
            reaction = null;
        }
        if (!reaction || user === target) {
            this.drawSrpgBattleActionName(target, reaction, padding, lineHeight * 0, false);
        } else {
            var damage = reaction.srpgPredictionDamage(user);
            var hit = reaction.itemHit(user);
            var eva = reaction.itemEva(user);
            
            this.drawSrpgBattleActionName(target, reaction, padding, lineHeight * 0, true);
            this.drawSrpgBattleHit(hit, eva, padding, lineHeight * 1);
            this.drawSrpgBattleDistance(target, reaction, 172 + padding, lineHeight * 1);
            this.drawSrpgBattleDamage(damage, padding, lineHeight * 2, doubleActionRate);
        }
        if (_srpgPredictionWindowMode === 2) return;
        // 行動順序
        BattleManager.makeActionOrders();
        this.contents.fontSize = 18;
        var order = BattleManager.actionBattlers();
        var doubleActioncheck = [];
        var doubleActionRate = 0;
        var iconBoxWidth = ImageManager.iconWidth + 4;
        var orderX = this.innerWidth / 2 - iconBoxWidth;
        var orderY = lineHeight - 2;
        var line = 0
        this.drawText('Action', orderX, -8, iconBoxWidth * 2, 'center');
        for (var i = 0; i < order.length; i++) {
            battler = order[i];
            if (user === battler && action && action.item()) {
                // 初回行動時
                if (doubleActioncheck.indexOf(battler) < 0) {
                    this.drawSrpgBattleOrders(battler, action.item(), orderX + iconBoxWidth, 17 + orderY * line);
                // ２回行動がある場合
                } else if (_srpgUseAgiAttackPlus === 'true' && doubleActioncheck.indexOf(battler) >= 0) {
                    actionRate = this.setDoubleActionRate(user, target);
                    if (actionRate > 0) {
                        this.drawSrpgBattleOrders(battler, action.item(), orderX + iconBoxWidth, 17 + orderY * line);
                        this.drawSrpgActionRate(actionRate, orderX + iconBoxWidth, 17 + orderY * line);
                    }
                }
                // 次の行へ
                doubleActioncheck.push(battler);
                line++; 
            } else if (target === battler && reaction && reaction.item()) {
                // 初回行動時
                if (doubleActioncheck.indexOf(battler) < 0) {
                    this.drawSrpgBattleOrders(battler, reaction.item(), orderX,  17 + orderY * line);
                    // 応戦が反撃率に応じる場合
                    if (_srpgBattleReaction === 2 && target.cnt > 0) {
                        this.drawSrpgActionRate(target.cnt * 100, orderX, 17 + orderY * line);
                    }
                // ２回行動がある場合
                } else if (_srpgUseAgiAttackPlus === 'true' && doubleActioncheck.indexOf(battler) >= 0) {
                    actionRate = this.setDoubleActionRate(target, user);
                    if (_srpgBattleReaction === 2 && target.cnt > 0) actionRate = Math.floor(actionRate * target.cnt);
                    if (actionRate > 0) {
                        this.drawSrpgBattleOrders(battler, reaction.item(), orderX,  17 + orderY * line);
                        this.drawSrpgActionRate(actionRate, orderX, 17 + orderY * line);
                    }
                }
                // 次の行へ
                doubleActioncheck.push(battler);
                line++; 
            }
        }
    };

    // 行動順序の描画
    Window_SrpgPrediction.prototype.drawSrpgBattleOrders = function(battler, item, x, y) {
        // 通常攻撃の場合、装備している武器アイコンを表示する
        if (DataManager.isSkill(item) && item.id === battler.attackSkillId() &&
            !battler.hasNoWeapons()) {
            if (battler.isActor()) {
                var item = battler.weapons()[0];
            } else {
                var item = $dataWeapons[Number(battler.enemy().meta.srpgWeapon)];
            }
            this.drawIcon(item.iconIndex, x + 2, y + 2);
        // 通常攻撃以外のスキルアイコンはそのまま表示する
        } else {
            this.drawIcon(item.iconIndex, x + 2, y + 2);
        }
    };

    // ２回行動の確率描画
    Window_SrpgPrediction.prototype.drawSrpgActionRate = function(actionRate, x, y) {
        var width = this.textWidth('000%');
        this.drawText(actionRate + '%', x, y + 10, width, 'center');
    };

    // 使用する攻撃名の描画
    Window_SrpgPrediction.prototype.drawSrpgBattleActionName = function(battler, action, x, y, flag) {
        if (action && flag === true) {
            var skill = action.item();
            if (skill) {
                var costWidth = this.costWidth();
                this.changePaintOpacity(this.isEnabled(battler, skill));
                // 通常攻撃の場合、装備している武器名を表示する
                if (DataManager.isSkill(skill) && skill.id === battler.attackSkillId() &&
                    !battler.hasNoWeapons()) {
                    if (battler.isActor()) {
                        var item = battler.weapons()[0];
                    } else {
                        var item = $dataWeapons[Number(battler.enemy().meta.srpgWeapon)];
                    }
                    this.drawItemName(item, x, y, 280 - costWidth);
                // 通常攻撃以外のスキル名はそのまま表示する
                } else {
                    this.drawItemName(skill, x, y, 280 - costWidth);
                }
                this.drawSkillCost(battler, skill, x, y, 288);
                this.changePaintOpacity(1);
            } else {
                this.drawText('------------', x + 52, y, 96, 'right');
            }
        } else {
            this.drawText('------------', x + 52, y, 96, 'right');
        }
    };

    // スキルの攻撃射程を描画する
    Window_SrpgPrediction.prototype.drawSrpgBattleDistance = function(battler, action, x, y) {
        var skill = action.item();
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(_textSrpgRange, x, y, 98);
        this.resetTextColor();
        var text = '';
        if (battler.srpgSkillMinRange(skill) > 0) {
            text += battler.srpgSkillMinRange(skill) + '-';
        }
        text += battler.srpgSkillRange(skill);
        this.drawText(text, x + 32, y, 96, 'right');
    };

    // 予想されるダメージ量を描画する
    Window_SrpgPrediction.prototype.drawSrpgBattleDamage = function(damage, x, y) {
        this.changeTextColor(ColorManager.systemColor());
        if (damage >= 0) {
            this.drawText(_textSrpgDamage, x, y, 164);
            this.resetTextColor();
            this.drawText(damage, x + 188, y, 112, 'right');
        } else {
            this.drawText(_textSrpgHealing, x, y, 164);
            this.resetTextColor();
            this.drawText(damage * -1, x + 188, y, 112, 'right');
        }
    };

    // 予想される命中率を描画する
    Window_SrpgPrediction.prototype.drawSrpgBattleHit = function(hit, eva, x, y) {
        var val = Math.floor((hit.clamp(0, 1.0) * (1.0 - eva).clamp(0, 1.0)) * 100); // 命中・回避を同時に処理する
        this.changeTextColor(ColorManager.systemColor());
        this.drawText(TextManager.param(8), x, y, 98);
        this.resetTextColor();
        this.drawText(val.clamp(0, 100) + '%', x + 80, y, 64, 'right');
    };

    // コストの文字列の幅を返す
    Window_SrpgPrediction.prototype.costWidth = function() {
        return this.textWidth('000');
    };

    // スキルのコストを描画する
    Window_SrpgPrediction.prototype.drawSkillCost = function(battler, skill, x, y, width) {
        if (battler.skillTpCost(skill) > 0) {
            this.changeTextColor(ColorManager.tpCostColor());
            this.drawText(battler.skillTpCost(skill), x, y, width, 'right');
        } else if (battler.skillMpCost(skill) > 0) {
            this.changeTextColor(ColorManager.mpCostColor());
            this.drawText(battler.skillMpCost(skill), x, y, width, 'right');
        }
    };

//====================================================================
// ●Window_ActorCommand
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘で使用するアクターコマンドウィンドウ
    //----------------------------------------------------------------    
    // commandListが存在するか返す
    Window_Command.prototype.isList = function() {
        if (this._list) {
            return true;
        } else {
            return false;
        }
    };

    // windowの高さを返す
    Window_ActorCommand.prototype.windowHeight = function() {
        return this.fittingHeight(this.numVisibleRows());
    };

    // コマンド数に応じてウィンドウの高さを調節する
    var _SRPG_Window_ActorCommand_numVisibleRows = Window_ActorCommand.prototype.numVisibleRows;
    Window_ActorCommand.prototype.numVisibleRows = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if (this.isList()) {
                return Math.min(this.maxItems(), 8);
            } else {
                return 1;
            }
        } else {
            return _SRPG_Window_ActorCommand_numVisibleRows.call(this);
        }
    };

    // アクターコマンドのリストを作成する
    var _SRPG_Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if (this._actor) {
                if (this._actor.actor().meta.srpgActorCommandList) {
                    var list = this._actor.actor().meta.srpgActorCommandList.split(',');
                } else {
                    var list = _srpgActorCommandList.split(',');
                }
                for (var i = 0; i < list.length; i++) {
                    switch (list[i]) {
                    case 'attack':
                        this.addAttackCommand();
                        break;
                    case 'skill':
                        this.addSkillCommands();
                        break;
                    case 'item':
                        this.addItemCommand();
                        break;
                    case 'equip':
                        this.addEquipCommand();
                        break;
                    case 'wait':
                        this.addWaitCommand();
                        break;
                    case 'original':
                        this.addOriginalCommand();
                        break;
                    }
                }
            }
        } else {
            _SRPG_Window_ActorCommand_makeCommandList.call(this);
        }
    };

    // コマンドに『装備』を加える
    Window_ActorCommand.prototype.addEquipCommand = function() {
        this.addCommand(_textSrpgEquip, 'equip', this._actor.canSrpgEquip());
    };

    // コマンドに『待機』を加える
    Window_ActorCommand.prototype.addWaitCommand = function() {
        this.addCommand(_textSrpgWait, 'wait');
    };

    // コマンドに『オリジナル』を加える
    // 別に指定したIDのスキルを直接実行する
    Window_ActorCommand.prototype.addOriginalCommand = function() {
        if (this._actor.actor().meta.srpgActorCommandOriginalId) {
            var skill = $dataSkills[Number(this._actor.actor().meta.srpgActorCommandOriginalId)]; 
        } else {
            var skill = $dataSkills[_srpgActorCommandOriginalId]; 
        }
        if (skill) {
            this.addCommand(skill.name, 'original', this._actor.canUse(skill));
        }
    };

    // アクターコマンドを準備する
    var _SRPG_Window_ActorCommand_setup = Window_ActorCommand.prototype.setup;
    Window_ActorCommand.prototype.setup = function(actor) {
        if ($gameSystem.isSRPGMode() === true) {
            this._actor = actor;
            this.clearCommandList();
            this.makeCommandList();
            this.updatePlacement();
            this.refresh();
            this.selectLast();
            this.activate();
            this.open();
        } else {
            _SRPG_Window_ActorCommand_setup.call(this, actor);
        }
    };

    // アクターコマンドの表示位置を調節する
    Window_ActorCommand.prototype.updatePlacement = function() {
        this.height = this.windowHeight();
        this.x = Math.max($gameTemp.activeEvent().screenX() - $gameMap.tileWidth() / 2 - this.width, 0);
        if ($gameTemp.activeEvent().screenY() < Graphics.boxHeight - 160) {
            var eventY = $gameTemp.activeEvent().screenY();
        } else {
            var eventY = Graphics.boxHeight - 160;
        }
        this.y = Math.max(eventY - this.windowHeight(), 0);
    };

//====================================================================
// ●Window_SrpgBattle
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘の戦闘開始を選択するウィンドウ
    //----------------------------------------------------------------
    // 初期化
    Window_SrpgBattle.prototype.initialize = function(rect) {
        Window_HorzCommand.prototype.initialize.call(this, rect);
        this._actor = null;
        this._item = null;
        this.openness = 0;
        this.deactivate();
    };

    // 一列あたりの項目の表示数
    Window_SrpgBattle.prototype.maxCols = function() {
        return 2;
    };

    // 行動が実行可能か返す（射程やコストが満たされているか）
    Window_SrpgBattle.prototype.isEnabled = function(item) {
        return this._actor && this._actor.canUse(item);
    };

    // アクターをクリアする
    Window_SrpgBattle.prototype.clearActor = function() {
        this._actor = null;
        this._item = null;
        this.clearCommandList();
    };

    // コマンドリストの作成
    Window_SrpgBattle.prototype.makeCommandList = function() {
        this.addCommand(TextManager.fight, 'battleStart', this.isEnabled(this._item));
        this.addCommand(TextManager.cancel, 'cancel');
    };

    // ウィンドウの準備
    Window_SrpgBattle.prototype.setup = function(actorArray) {
        this._actor = actorArray[1];
        this._item = actorArray[1].currentAction().item();
        this.clearCommandList();
        this.makeCommandList();
        this.refresh();
        this.activate();
        this.open();
    };

//====================================================================
// ●Window_BattleLog
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘時の戦闘シーンで戦闘経過を表示するウィンドウ
    //----------------------------------------------------------------
    // エネミーの通常攻撃アニメーションを設定する
    var _SRPG_Window_BattleLog_showEnemyAttackAnimation = Window_BattleLog.prototype.showEnemyAttackAnimation;
    Window_BattleLog.prototype.showEnemyAttackAnimation = function(subject, targets) {
        if ($gameSystem.isSRPGMode() === true) {
            this.showNormalAnimation(targets, subject.attackAnimationId(), false);
        } else {
            _SRPG_Window_BattleLog_showEnemyAttackAnimation.call(this, subject, targets);
        }
    };

//====================================================================
// ●Window_MenuStatus
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘時のメニュー画面のステータスウィンドウ
    //----------------------------------------------------------------
    // 行動終了や行動不能のユニットの表示を変更する
    const _SRPG_Window_MenuStatus_drawItemImage = Window_MenuStatus.prototype.drawItemImage;
    Window_MenuStatus.prototype.drawItemImage = function(index) {
        if ($gameSystem.isSRPGMode() === true) {
            const actor = this.actor(index);
            const rect = this.itemRect(index);
            const width = ImageManager.faceWidth;
            const height = rect.height - 2;
            if (actor.srpgTurnEnd() === true || actor.isRestricted() === true) {
                this.changePaintOpacity(false);
            }
            this.drawActorFace(actor, rect.x + 1, rect.y + 1, width, height);
            this.changePaintOpacity(true);
        } else {
            _SRPG_Window_MenuStatus_drawItemImage.call(this, index);
        }
    };

//====================================================================
// ●Window_MenuCommand
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘時のメニュー画面のコマンド
    //----------------------------------------------------------------
    // コマンドのリストを作成する
    var _SRPG_Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        if ($gameSystem.isSRPGMode() === true) {
            var list = _srpgMenuCommandList.split(',');
            var enabled = this.areMainCommandsEnabled();
            for (var i = 0; i < list.length; i++) {
                switch (list[i]) {
                case 'item':
                    this.addCommand(TextManager.item, 'item', enabled);
                    break;
                case 'skill':
                    this.addCommand(TextManager.skill, 'skill', enabled);
                    break;
                case 'equip':
                    this.addCommand(TextManager.equip, 'equip', enabled);
                    break;
                case 'status':
                    this.addCommand(TextManager.status, 'status', enabled);
                    break;
                case 'formation':
                    this.addFormationCommand();
                    break;
                case 'options':
                    this.addOptionsCommand();
                    break;
                case 'save':
                    this.addSaveCommand();
                    break;
                case 'gameEnd':
                    this.addGameEndCommand();
                    break;
                case 'original':
                    this.addOriginalCommands();
                    break;
                case 'turnEnd':
                    this.addTurnEndCommand();
                    break;
                case 'autoBattle':
                    this.addAutoBattleCommand(enabled);
                    break;
                case 'winLose':
                    this.addWinLoseConditionCommand();
                    break;
                }
            }
        } else {
            _SRPG_Window_MenuCommand_makeCommandList.call(this);
        }
    };

    // ターン終了コマンドを追加する
    Window_MenuCommand.prototype.addTurnEndCommand = function() {
        const enabled = this.isTurnEndEnabled();
        this.addCommand(_textSrpgTurnEnd, 'turnEnd', enabled);
    };

    // オート戦闘コマンドを追加する
    Window_MenuCommand.prototype.addAutoBattleCommand = function(enabled) {
        if (_srpgAutoBattleStateId > 0) this.addCommand(_textSrpgAutoBattle, 'autoBattle', enabled);
    };

    // 勝敗条件コマンドを追加する
    Window_MenuCommand.prototype.addWinLoseConditionCommand = function() {
        var array = $gameSystem.srpgWinLoseCondition();
        if (array && array.length > 0) {
            var enabled = true;
        } else {
            var enabled = false;
        }
        this.addCommand(_textSrpgWinLoseCondition, 'winLoseCondition', enabled);
    };

    Window_MenuCommand.prototype.isTurnEndEnabled = function() {
        return true;
    };
    
//====================================================================
// ●Window_WinLoseCondition
//====================================================================
    //----------------------------------------------------------------
    // SRPG戦闘時の勝敗条件を表示するウィンドウ
    //----------------------------------------------------------------
    // 初期化
    Window_WinLoseCondition.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.refresh();
        this.openness = 0;
    };

    // リフレッシュ
    Window_WinLoseCondition.prototype.refresh = function() {
        this.contents.clear();
        var array = $gameSystem.srpgWinLoseCondition();
        if (array && array.length > 0) {
            var line = 0;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(_textSrpgWinCondition, 0, line * this.lineHeight(), this.width - 32, 'center');
            line += 1;
            this.changeTextColor(ColorManager.normalColor());
            for (var i = 0; i < array.length; i++) {
                if (array[i][0] == 'win') {
                    this.drawText(array[i][1], 0, line * this.lineHeight(), this.width - 32, 'center');
                    line += 1;
                }
            }
            line += 1;
            this.changeTextColor(ColorManager.systemColor());
            this.drawText(_textSrpgLoseCondition, 0, line * this.lineHeight(), this.width - 32, 'center');
            line += 1;
            this.changeTextColor(ColorManager.normalColor());
            for (var i = 0; i < array.length; i++) {
                if (array[i][0] == 'lose') {
                    this.drawText(array[i][1], 0, line * this.lineHeight(), this.width - 32, 'center');
                    line += 1;
                }
            }
        }
    };

//====================================================================
// ●BattleManager
//====================================================================
    //----------------------------------------------------------------
    // 初期化
    //----------------------------------------------------------------
    var _SRPG_BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function() {
        _SRPG_BattleManager_initMembers.call(this);
        this._srpgBattleStatusWindowLeft = null;
        this._srpgBattleStatusWindowRight = null;
        this._srpgBattleResultWindow = null;
        this._srpgBattleResultWindowCount = 0;
        this._agilityRate = 0;
    };

    //----------------------------------------------------------------
    // ウィンドウの処理
    //----------------------------------------------------------------
    /*
    // SRPG戦闘の戦闘シーン用のステータスウィンドウのセット
    BattleManager.setSrpgBattleStatusWindow = function(left, right) {
        this._srpgBattleStatusWindowLeft = left;
        this._srpgBattleStatusWindowRight = right;
    };

    // ステータスウィンドウのリフレッシュ
    var _SRPG_BattleManager_refreshStatus = BattleManager.refreshStatus;
    BattleManager.refreshStatus = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this._srpgBattleStatusWindowLeft.refresh();
            this._srpgBattleStatusWindowRight.refresh();
        } else {
            _SRPG_BattleManager_refreshStatus.call(this);
        }
    };
    */

    // リザルトウィンドウのセット
    BattleManager.setSrpgBattleResultWindow = function(window) {
        this._srpgBattleResultWindow = window;
    };

    //----------------------------------------------------------------
    // 戦闘シーンの進行の処理
    //----------------------------------------------------------------
    // 戦闘開始
    var _SRPG_BattleManager_startBattle = BattleManager.startBattle;
    BattleManager.startBattle = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this._phase = 'start';
            $gameSystem.onBattleStart();
            $gameParty.onBattleStart();
            $gameTroop.onBattleStart();
        } else {
            _SRPG_BattleManager_startBattle.call(this);
        }
    };

    // 入力開始
    // SRPG戦闘時はコマンド入力をスキップして、すぐにターンを開始する
    var _SRPG_BattleManager_startInput = BattleManager.startInput;
    BattleManager.startInput = function() {
        if ($gameSystem.isSRPGMode() === true) {
            //this.clearActor();
            this.startTurn();
        } else {
            _SRPG_BattleManager_startInput.call(this);
        }
    };

    // 行動順序の作成
    var _SRPG_AAP_BattleManager_makeActionOrders = BattleManager.makeActionOrders;
    BattleManager.makeActionOrders = function() {
        _SRPG_AAP_BattleManager_makeActionOrders.call(this); // 敏捷, 速度補正をもとに行動順を作成する
        // 敏捷差で２回攻撃する場合、敏捷差から行動確率を計算し、行動を保存する
        var user = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
		var target = $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1];
        if (_srpgUseAgiAttackPlus === 'true') {
            if (user.agi >= target.agi) {
                var firstBattler = user;
                var secondBattler = target;
            } else {
                var firstBattler = target;
                var secondBattler = user;
            }
            if (!firstBattler.currentAction() || !firstBattler.currentAction().item()) {
                return;
            }
            if (firstBattler.currentAction().isForOpponent() &&
                firstBattler.currentAction().item().meta.doubleAction !== 'false') {
                var dif = firstBattler.agi - secondBattler.agi;
                var difMax = secondBattler.agi * _srpgAgilityAffectsRatio - secondBattler.agi;
                if (difMax === 0) {
                    this._agilityRate = 100;
                } else {
                    this._agilityRate = dif / difMax * 100;
                }
                firstBattler.reserveSameAction();
                this._actionBattlers.push(firstBattler);
            }
        }
    };

    // action終了時にendActionを実行しないようにする
    BattleManager.endBattlerActions = function(battler) {
        battler.setActionState(this.isTpb() ? "undecided" : "done");
        //battler.onAllActionsEnd();
        battler.clearTpbChargeTime();
        this.displayBattlerStatus(battler, true);
    };

    // 次に行動するバトラーを取得する
    var _SRPG_AAP_BattleManager_getNextSubject = BattleManager.getNextSubject;
    BattleManager.getNextSubject = function() {
        if (_AAPwithYEP_BattleEngineCore === 'false') {
            var battler = _SRPG_AAP_BattleManager_getNextSubject.call(this);
            if (battler) {
                battler.addSameAction(this._agilityRate);
            }
        } else {
            var battler = this.getNextSubjectWithYEP();
            if (battler) {
                battler.addSameAction(this._agilityRate);
            }
        }
        return battler;
    };

    // 行動順に並んだバトラーの配列を返す
    BattleManager.actionBattlers = function() {
        return this._actionBattlers;
    };

    // castAnimationの実行
    // YEPプラグインへの対応
    BattleManager.actionCastAnimation = function() {
        if (!$gameSystem.isSideView() && this._subject.isActor()) return true;
        if (!this._action.isGuard() && this._action.isSkill()) {
            if (this._action.item().castAnimation > 0) {
                var ani = $dataAnimations[this._action.item().castAnimation]
                this._logWindow.showAnimation(this._subject, [this._subject], ani);
            }
        }
        return true;
    };

    // 行動の実行
    // YEPプラグインにも対応する
    var _SRPG_BattleManager_invokeAction = BattleManager.invokeAction;
    BattleManager.invokeAction = function(subject, target) {
        if ($gameSystem.isSRPGMode() === true) {
            if (_AAPwithYEP_BattleEngineCore === 'true') {
                if (!eval(Yanfly.Param.BECOptSpeed)) this._logWindow.push('pushBaseLine');
                if (Math.random() < this._action.itemMrf(target)) {
                    this.invokeMagicReflection(subject, target);
                /* Cnt(反撃率)による反撃は無効化する（応戦と機能が重複し、かつ混乱を招くため）
                } else if (Math.random() < this._action.itemCnt(target)) {
                    var attackSkill = $dataSkills[target.attackSkillId()]
                    if (target.canUse(attackSkill) === true) {
                        this.invokeCounterAttack(subject, target);
                    } else {
                        this.invokeNormalAction(subject, target);
                    }
                */
                } else {
                    this.invokeNormalAction(subject, target);
                }
                if (subject) subject.setLastTarget(target);
                if (!eval(Yanfly.Param.BECOptSpeed)) this._logWindow.push('popBaseLine');
                //this.refreshStatus();
            } else {
                this._logWindow.push('pushBaseLine');
                /* Cnt(反撃率)による反撃は無効化する（応戦と機能が重複し、かつ混乱を招くため）
                if (Math.random() < this._action.itemCnt(target)) {
                    var attackSkill = $dataSkills[target.attackSkillId()];
                    if (target.canUse(attackSkill) == true) {
                        this.invokeCounterAttack(subject, target);
                    } else {
                        this.invokeNormalAction(subject, target);
                    }
                } else */
                if (Math.random() < this._action.itemMrf(target)) {
                    this.invokeMagicReflection(subject, target);
                } else {
                    this.invokeNormalAction(subject, target);
                }
                subject.setLastTarget(target);
                this._logWindow.push('popBaseLine');
                //this.refreshStatus();
            }
        } else {
            _SRPG_BattleManager_invokeAction.call(this, subject, target);
        }
    };

    // 戦闘終了のチェック（SRPG戦闘では無効化する）
    var _SRPG_BattleManager_checkBattleEnd = BattleManager.checkBattleEnd;
    BattleManager.checkBattleEnd = function() {
        if (!$gameSystem.isSRPGMode()) {
            return _SRPG_BattleManager_checkBattleEnd.call(this);
        } else {
            return false;
        }
    };

    var _SRPG_BattleManager_checkAbort = BattleManager.checkAbort;
    BattleManager.checkAbort = function() {
        if (!$gameSystem.isSRPGMode()) {
            return _SRPG_BattleManager_checkAbort.call(this);
        } else {
            if (this.isAborting()) {
                this.processAbort();
                return true;
            }
            return false;
        }
    };

    var _SRPG_BattleManager_checkAbort2 = BattleManager.checkAbort2;
    BattleManager.checkAbort2 = function() {
        if (!$gameSystem.isSRPGMode()) {
            return _SRPG_BattleManager_checkAbort2.call(this);
        } else {
            if (this.isAborting()) {
                SoundManager.playEscape();
                this._escaped = true;
                this.processAbort();
            }
            return false;
        }
    };

    //----------------------------------------------------------------
    // 戦闘シーンでのターン終了時の処理
    //----------------------------------------------------------------
    // SRPG戦闘の戦闘シーンでは、ターン終了と同時に戦闘を終了する
    var _SRPG_BattleManager_endTurn = BattleManager.endTurn;
    BattleManager.endTurn = function() {
        if ($gameSystem.isSRPGMode() == true) {
            this._phase = 'battleEnd';
            this._preemptive = false;
            this._surprise = false;
            //this.refreshStatus();
            if (this._phase) {
                if ($gameParty.battleMembers()[0] && $gameParty.battleMembers()[0].isAlive()) {
                    this.processSrpgVictory();
                } else {
                    this.endBattle(3);
                }
            }
        } else {
            _SRPG_BattleManager_endTurn.call(this);
        }
    };

    // 戦闘終了の処理（勝利）
    BattleManager.processSrpgVictory = function() {
        if ($gameTroop.members()[0] && $gameTroop.isAllDead()) {
            $gameParty.performVictory();
        }
        this.makeRewards();
        this._srpgBattleResultWindow.setRewards(this._rewards);
        var se = {};
        se.name = _rewardSe;
        se.pan = 0;
        se.pitch = 100;
        se.volume = 90;
        AudioManager.playSe(se);
        this._srpgBattleResultWindow.open();
        this._srpgBattleResultWindowCount = 90;
        this.gainRewards();
    };

    // 経験値の入手
    var _SRPG_BattleManager_gainExp = BattleManager.gainExp;
    BattleManager.gainExp = function() {
        if ($gameSystem.isSRPGMode() == true) {
            var exp = this._rewards.exp;
            $gameParty.battleMembers()[0].gainExp(exp);
        } else {
            _SRPG_BattleManager_gainExp.call(this);
        }
    };

    // 戦闘終了の処理（共通）
    var _SRPG_BattleManager_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
        _SRPG_BattleManager_endBattle.call(this, result);
        if (this._srpgBattleResultWindow) {
            this._srpgBattleResultWindow.close();
        }
        this.replayBgmAndBgs();
        if ($gameParty.battleMembers()[0] && $gameParty.battleMembers()[0].isAlive()) $gameParty.battleMembers()[0].onAllActionsEnd();
		if ($gameParty.battleMembers()[1] && $gameParty.battleMembers()[1].isAlive()) $gameParty.battleMembers()[1].onAllActionsEnd();
		if ($gameTroop.members()[0] && $gameTroop.members()[0].isAlive()) $gameTroop.members()[0].onAllActionsEnd();
		if ($gameTroop.members()[1] && $gameTroop.members()[1].isAlive()) $gameTroop.members()[1].onAllActionsEnd();
        $gameSystem.setSubBattlePhase('after_battle');
    };

    // 戦闘終了処理のアップデート
    var _SRPG_BattleManager_updateBattleEnd = BattleManager.updateBattleEnd;
    BattleManager.updateBattleEnd = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if ($gameSystem.isSubBattlePhase() === 'after_battle') {
                SceneManager.pop();
                this._phase = null;
            } else if (this._srpgBattleResultWindow.isChangeExp() === false) {
                if (this._srpgBattleResultWindowCount <= 0 ||
                    Input.isPressed('ok') || TouchInput.isPressed()) {
                    this.endBattle(3);
                }
                this._srpgBattleResultWindowCount -= 1;
            }
        } else {
            _SRPG_BattleManager_updateBattleEnd.call(this);
        }
    };

    //----------------------------------------------------------------
    // YEPプラグインへの対応
    //----------------------------------------------------------------
    BattleManager.getNextSubjectWithYEP = function() {
        for (;;) {
            var battler = this._actionBattlers.shift();
            if (!battler) {
                return null;
            }
            if (battler.isBattleMember() && battler.isAlive()) {
                return battler;
            }
        }
    };

//====================================================================
// ●Scene_Base
//====================================================================
    // SRPG戦闘中はゲームオーバーのチェックを無効化する
    var _SRPG_Scene_Base_checkGameover = Scene_Base.prototype.checkGameover;
    Scene_Base.prototype.checkGameover = function() {
        if (!$gameSystem.isSRPGMode()) {
            _SRPG_Scene_Base_checkGameover.call(this);
        }
    };

//====================================================================
// ●Scene_MenuBase
//====================================================================
    // SRPG戦闘中でアクターコマンドを開いている時は、キャラクターの変更を止める
    var _SRPG_Scene_MenuBase_nextActor = Scene_MenuBase.prototype.nextActor;
    Scene_MenuBase.prototype.nextActor = function() {
        if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_command_window') {
            this._commandWindow.activate();
            return;
        }
        _SRPG_Scene_MenuBase_nextActor.call(this);
    };
    
    var _SRPG_Scene_MenuBase_previousActor = Scene_MenuBase.prototype.previousActor;
    Scene_MenuBase.prototype.previousActor = function() {
        if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_command_window') {
            this._commandWindow.activate();
            return;
        }
        _SRPG_Scene_MenuBase_previousActor.call(this);
    };

//====================================================================
// ●Scene_Map
//====================================================================
    //----------------------------------------------------------------
    // 初期化
    //----------------------------------------------------------------
    var _SRPG_SceneMap_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
        _SRPG_SceneMap_initialize.call(this);
        this._callSrpgBattle = false;
    };

    //----------------------------------------------------------------
    // 基本的な処理
    //----------------------------------------------------------------
    // フェード速度を返す
    Scene_Map.prototype.fadeSpeed = function() {
        if ($gameSystem.isSRPGMode() === true && _srpgBattleQuickLaunch === 'true') {
           return 12;
        } else {
           return Scene_Base.prototype.fadeSpeed.call(this);
        }
    };

    // セーブファイルをロードした際に画像をプリロードする
    var _SRPG_Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _SRPG_Scene_Map_start.call(this);
        if ($gameTemp.isSrpgLoadFlag() === true) {
            $gameSystem.preloadFaceGraphic(); //顔グラフィックをプリロードする
            $gameTemp.setSrpgLoadFlag(false);
        }
    };

    //----------------------------------------------------------------
    // ウィンドウの作成
    //----------------------------------------------------------------
    // 全てのウィンドウ作成
    var _SRPG_SceneMap_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _SRPG_SceneMap_createAllWindows.call(this);
        this.createSrpgStatusWindow();
        this.createSrpgActorCommandStatusWindow();
        this.createSrpgTargetWindow();
        this.createSrpgPredictionWindow();
        this.createSrpgActorCommandWindow();
        this.createSrpgBattleWindow();
        this.createHelpWindow();
        this.createSkillWindow();
        this.createItemWindow();
        this.createLogWindow();
        this.createDeadActorWindow();
    };

    // ウィンドウ範囲の設定
    Scene_Map.prototype.helpAreaTop = function() {
        return this.buttonAreaBottom();
    };

    Scene_Map.prototype.helpAreaBottom = function() {
        return this.helpAreaTop() + this.helpAreaHeight();
    };

    Scene_Map.prototype.helpAreaHeight = function() {
        return this.calcWindowHeight(2, false);
    };

    Scene_Map.prototype.windowAreaTop = function() {
        return this.helpAreaBottom();
    };
    
    Scene_Map.prototype.windowAreaHeight = function() {
        return this.calcWindowHeight(7, true) + 2;
    };

    Scene_Map.prototype.windowAreaBottom = function() {
        return this.windowAreaTop() + this.windowAreaHeight();
    };

    Scene_Map.prototype.mainAreaTop = function() {
        if (!this.isBottomHelpMode()) {
            return this.helpAreaBottom();
        } else if (this.isBottomButtonMode()) {
            return 0;
        } else {
            return this.buttonAreaBottom();
        }
    };
    
    Scene_Map.prototype.mainAreaBottom = function() {
        return this.mainAreaTop() + this.mainAreaHeight();
    };
    
    Scene_Map.prototype.mainAreaHeight = function() {
        return Graphics.boxHeight - this.buttonAreaHeight() - this.helpAreaHeight();
    };

    // ボタンウィンドウを作る
    Scene_Map.prototype.createButtons = function() {
        if (ConfigManager.touchUI) {
            this.createMenuButton();
            this.createCancelButton();
        }
    };

    Scene_Map.prototype.createMenuButton = function() {
        this._menuButton = new Sprite_Button("menu");
        this._menuButton.x = Graphics.boxWidth - this._menuButton.width - 4;
        this._menuButton.y = this.buttonY();
        this._menuButton.visible = false;
        this.addWindow(this._menuButton);
    };

    Scene_Map.prototype.createCancelButton = function() {
        this._cancelButton = new Sprite_Button("cancel");
        this._cancelButton.x = Graphics.boxWidth - this._cancelButton.width - 4;
        this._cancelButton.y = this.buttonY();
        this._cancelButton.visible = false;
        this.addWindow(this._cancelButton);
   };
    

    // ステータスウィンドウを作る
    Scene_Map.prototype.createSrpgStatusWindow = function() {
        const rect = this.srpgStatusWindowRect(false);
        this._mapSrpgStatusWindow = new Window_SrpgStatus(rect);
        this._mapSrpgStatusWindow.openness = 0;
        this.addWindow(this._mapSrpgStatusWindow);
    };
    
    // ターゲットのステータスウィンドウを作る
    Scene_Map.prototype.createSrpgTargetWindow = function() {
        const rect = this.srpgStatusWindowRect(true);
        this._mapSrpgTargetWindow = new Window_SrpgStatus(rect);
        this._mapSrpgTargetWindow.openness = 0;
        this.addWindow(this._mapSrpgTargetWindow);
    };

    // ステータスウィンドウ ターゲットウィンドウのrectを設定する
    Scene_Map.prototype.srpgStatusWindowRect = function(target) {
        const ww = Graphics.boxWidth / 2 - 6;
        const wh = this.calcWindowHeight(10, false);
        const wx = target ? 0 : Graphics.boxWidth - ww;
        const wy = 0;
        return new Rectangle(wx, wy, ww, wh);
    };

    // アクターコマンド表示時のステータスウィンドウを作る
    Scene_Map.prototype.createSrpgActorCommandStatusWindow = function() {
        const rect = this.srpgActorCommandStatusWindowRect();
        this._mapSrpgActorCommandStatusWindow = new Window_SrpgActorCommandStatus(rect);
        this._mapSrpgActorCommandStatusWindow.openness = 0;
        this.addWindow(this._mapSrpgActorCommandStatusWindow);
    };

    // アクターコマンド表示時のステータスウィンドウのrectを設定する
    Scene_Map.prototype.srpgActorCommandStatusWindowRect = function() {
        const ww = Graphics.boxWidth - 240;
        const wh = this.calcWindowHeight(3, false);
        const wx = 120;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    // 戦闘結果予測ウィンドウを作る
    Scene_Map.prototype.createSrpgPredictionWindow = function() {
        const rect = this.srpgPredictionWindowRect();
        this._mapSrpgPredictionWindow = new Window_SrpgPrediction(rect);
        this._mapSrpgPredictionWindow.openness = 0;
        this.addWindow(this._mapSrpgPredictionWindow);
    };

    // 戦闘結果予測ウィンドウのrectを設定する
    Scene_Map.prototype.srpgPredictionWindowRect = function() {
        const ww = Graphics.boxWidth;
        let wh = 0;
        if (_srpgPredictionWindowMode === 2) {
            // 攻撃の名前のみ表示
            wh = this.calcWindowHeight(1, false);
        } else {
            // フル表示または表示なし
            if (_srpgUseAgiAttackPlus === 'true' && _srpgBattleReaction !== 3) {
                wh = this.calcWindowHeight(3, false) + 12;
            } else {
                wh = this.calcWindowHeight(3, false);
            }
        }
        const wx = 0;
        const wy = this._mapSrpgStatusWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    // アクターコマンドウィンドウを作る
    Scene_Map.prototype.createSrpgActorCommandWindow = function() {
        const rect = this.actorCommandWindowRect();
        this._mapSrpgActorCommandWindow = new Window_ActorCommand(rect);
        this._mapSrpgActorCommandWindow.setHandler('attack', this.commandAttack.bind(this));
        this._mapSrpgActorCommandWindow.setHandler('skill',  this.commandSkill.bind(this));
        this._mapSrpgActorCommandWindow.setHandler('item',   this.commandItem.bind(this));
        this._mapSrpgActorCommandWindow.setHandler('equip',   this.commandEquip.bind(this));
        this._mapSrpgActorCommandWindow.setHandler('wait',  this.commandWait.bind(this));
        this._mapSrpgActorCommandWindow.setHandler('original',  this.commandOriginal.bind(this));
        this._mapSrpgActorCommandWindow.setHandler('cancel', this.selectPreviousActorCommand.bind(this));
        this.addWindow(this._mapSrpgActorCommandWindow);
    };

    Scene_Map.prototype.actorCommandWindowRect = function() {
        const ww = 192;
        const wh = this.calcWindowHeight(8, true);
        const wx = Math.max(Graphics.boxWidth / 2 - ww, 0);
        const wy = Math.max(Graphics.boxHeight / 2 - wh, 0);
        return new Rectangle(wx, wy, ww, wh);
    };

    // ヘルプウィンドウを作る
    Scene_Map.prototype.createHelpWindow = function() {
        const rect = this.helpWindowRect();
        this._helpWindow = new Window_Help(rect);
        this._helpWindow.visible = false;
        this.addWindow(this._helpWindow);
    };

    Scene_Map.prototype.helpWindowRect = function() {
        const wx = 0;
        const wy = this.helpAreaTop();
        const ww = Graphics.boxWidth;
        const wh = this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    // スキルウィンドウを作る
    Scene_Map.prototype.createSkillWindow = function() {
        const rect = this.skillWindowRect();
        this._skillWindow = new Window_BattleSkill(rect);
        this._skillWindow.setHelpWindow(this._helpWindow);
        this._skillWindow.setHandler('ok',     this.onSkillOk.bind(this));
        this._skillWindow.setHandler('cancel', this.onSkillCancel.bind(this));
        this.addWindow(this._skillWindow);
    };

    Scene_Map.prototype.skillWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = this.windowAreaHeight();
        const wx = 0;
        const wy = this.windowAreaTop();
        return new Rectangle(wx, wy, ww, wh);
    };

    // アイテムウィンドウを作る
    Scene_Map.prototype.createItemWindow = function() {
        const rect = this.itemWindowRect();
        this._itemWindow = new Window_BattleItem(rect);
        this._itemWindow.setHelpWindow(this._helpWindow);
        this._itemWindow.setHandler('ok',     this.onItemOk.bind(this));
        this._itemWindow.setHandler('cancel', this.onItemCancel.bind(this));
        this.addWindow(this._itemWindow);
    };

    Scene_Map.prototype.itemWindowRect = function() {
        return this.skillWindowRect();
    };

    // 戦闘開始ウィンドウを作る
    Scene_Map.prototype.createSrpgBattleWindow = function() {
        const rect = this.srpgBattleWindowRect();
        this._mapSrpgBattleWindow = new Window_SrpgBattle(rect);
        this._mapSrpgBattleWindow.setHandler('battleStart', this.commandBattleStart.bind(this));
        this._mapSrpgBattleWindow.setHandler('cancel', this.selectPreviousSrpgBattleStart.bind(this));
        this.addWindow(this._mapSrpgBattleWindow);
    };

    // 戦闘開始ウィンドウのrectを設定する
    Scene_Map.prototype.srpgBattleWindowRect = function() {
        const ww = 480;
        const wh = this.calcWindowHeight(1, true);
        const wx = Math.max((Graphics.boxWidth - ww) / 2, 120);
        const wy = this._mapSrpgStatusWindow.height + this._mapSrpgPredictionWindow.height;
        return new Rectangle(wx, wy, ww, wh);
    };

    // マップバトル時のスキル名ウィンドウを作る
    Scene_Map.prototype.createLogWindow = function() {
        const rect = this.logWindowRect();
        this._logWindow = new Window_BattleLog(rect);
        this.addWindow(this._logWindow);
        this._logWindow.hide();
    };

    Scene_Map.prototype.logWindowRect = function() {
        const wx = 0;
        const wy = 0;
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(10, false);
        return new Rectangle(wx, wy, ww, wh);
    };

    // 戦闘不能回復スキル・アイテム使用時のターゲットウィンドウを作る
    Scene_Map.prototype.createDeadActorWindow = function() {
        const rect = this.actorWindowRect();
        this._deadActorWindow = new Window_MenuActor(rect);
        this._deadActorWindow.setHandler('ok',     this.onDeadActorOk.bind(this));
        this._deadActorWindow.setHandler('cancel', this.onDeadActorCancel.bind(this));
        this.addWindow(this._deadActorWindow);
    };

    Scene_Map.prototype.actorWindowRect = function() {
        const wx = 0;
        const wy = Math.min(this.mainAreaTop(), this.helpAreaTop());
        const ww = Graphics.boxWidth - this.mainCommandWidth();
        const wh = this.mainAreaHeight() + this.helpAreaHeight();
        return new Rectangle(wx, wy, ww, wh);
    };

    //----------------------------------------------------------------
    // プレイヤーの操作に関わる処理
    //----------------------------------------------------------------
    // メニューの呼び出し許可
    const _SRPG_SceneMap_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        if ($gameSystem.isSRPGMode() === true) {
            return $gameSystem.isMenuEnabled() && !$gameMap.isEventRunning() &&
                   ($gameSystem.isBattlePhase() === 'actor_phase' && $gameSystem.isSubBattlePhase() === 'normal');
        } else {
            return _SRPG_SceneMap_isMenuEnabled.call(this);
        }
    };

    // キャンセルボタンの許可
    Scene_Map.prototype.isCancelButtonEnabled = function() {
        if ($gameSystem.isSubBattlePhase() === 'actor_move' ||
            $gameSystem.isSubBattlePhase() === 'actor_command_window' ||
            $gameSystem.isSubBattlePhase() === 'actor_target') {
            return true;
        } else {
            return false;
        }
    };

    // タッチした場所にキャンセルボタンが存在するかの判定
    // 仕様上、マップの一番右上にはタッチで移動できなくなる
    Scene_Map.prototype.touchOnCancelButton = function() {
        if (!ConfigManager.touchUI) return false;
        return $gameSystem.isSRPGMode() && this.isCancelButtonEnabled() &&
               (TouchInput.x >= this._cancelButton.x && TouchInput.y <= this._cancelButton.y * 2 + this._cancelButton.height);
    };

    // キャンセルボタンの位置にはカーソルを移動しない
    const _SRPG_SceneMap_onMapTouch = Scene_Map.prototype.onMapTouch;
    Scene_Map.prototype.onMapTouch = function() {
        if (this.touchOnCancelButton()) return;
        _SRPG_SceneMap_onMapTouch.call(this);
    };

    // メニューボタン・キャンセルボタンの表示・非表示・表示位置調整を行う
    const _SRPG_SceneMap_updateMenuButton = Scene_Map.prototype.updateMenuButton;
    Scene_Map.prototype.updateMenuButton = function() {
        _SRPG_SceneMap_updateMenuButton.call(this);
        if ($gameSystem.isSRPGMode() === true) {
            if (this._cancelButton) {
                const cancelButtonEnabled = this.isCancelButtonEnabled();
                if (cancelButtonEnabled === this._cancelButtonEnabled) {
                    this._cancelButton.visible = this._cancelButtonEnabled;
                } else {
                    this._cancelButtonEnabled = cancelButtonEnabled;
                }
            }
        }
    };

    // キャンセルキー、その他のキーの実行を止める場合
    Scene_Map.prototype.srpgCanNotUpdateCallMenu = function(){
        return ($gameSystem.srpgWaitMoving() == true ||
        $gameTemp.isAutoMoveDestinationValid() == true ||
        //$gameSystem.isSubBattlePhase() === 'status_window' ||
        $gameSystem.isSubBattlePhase() === 'actor_command_window' ||
        $gameSystem.isSubBattlePhase() === 'battle_window' ||
        $gameSystem.isSubBattlePhase() === 'invoke_action' ||
        $gameSystem.isBattlePhase() !== 'actor_phase')
    }

    // アクターの移動処理キャンセル
    Scene_Map.prototype.srpgCancelActorMove = function(){
        SoundManager.playCancel();
        $gameSystem.setSubBattlePhase('normal');
        $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
        $gameParty.clearSrpgBattleActors();
        $gameTemp.clearActiveEvent();
        $gameTemp.clearMoveTable();
    }

    // サブフェーズの状況に応じてキャンセルキーやその他のキーの処理を実行する
    const _SRPG_SceneMap_updateCallMenu = Scene_Map.prototype.updateCallMenu;
    Scene_Map.prototype.updateCallMenu = function() {
        if ($gameSystem.isSRPGMode() === true) {
            // 自動で動いている時は処理を止める
            if (this.srpgCanNotUpdateCallMenu()) {
                this.menuCalling = false;
                return;
            }
            // ステータスウィンドウの表示時
            if ($gameSystem.isSubBattlePhase() === 'status_window' && this.isMenuCalled()) {
                $gameSystem.clearSrpgStatusWindowNeedRefresh();
                SoundManager.playCancel();
                $gameTemp.clearActiveEvent();
                $gameSystem.setSubBattlePhase('normal');
                $gameTemp.clearMoveTable();
                return true;
            }
            // LRボタンが押された時にユニットを順番に選択する
            if ($gameSystem.isSubBattlePhase() === 'normal') {
                if (Input.isTriggered('pageup')) {
                    SoundManager.playCursor();
                    $gameSystem.getNextLActor();
                } else if (Input.isTriggered('pagedown')) {
                    SoundManager.playCursor();
                    $gameSystem.getNextRActor();
                }
            }
            // 移動状態の時はキャンセルの処理をする
            if ($gameSystem.isSubBattlePhase() === 'actor_move') {
                if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                    this.srpgCancelActorMove();
                }
            // 対象選択状態の時はキャンセルの処理をする
            } else if ($gameSystem.isSubBattlePhase() === 'actor_target') {
                if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                    SoundManager.playCancel();
                    this.reSetMoveRangeTable();
                    $gameSystem.setSubBattlePhase('actor_command_window');
                }
            // その他の時はメニュー画面を呼び出す
            } else {
                _SRPG_SceneMap_updateCallMenu.call(this);
            }
        } else {
            _SRPG_SceneMap_updateCallMenu.call(this);
        }
    };

    // キャンセルなどの場合に移動＋射程範囲を再表示する
    Scene_Map.prototype.reSetMoveRangeTable = function() {
        const event = $gameTemp.activeEvent();
        const battlerArray = $gameSystem.EventToUnit(event.eventId());
        $gameSystem.srpgMakeMoveTableOriginalPos(event);
        $gameTemp.setResetMoveList(true);
        $gameSystem.setSrpgActorCommandWindowNeedRefresh(battlerArray);
        $gameTemp.clearArea(); // clear AoE
    };


    //----------------------------------------------------------------
    // 更新
    //----------------------------------------------------------------
    // マップの更新
    var _SRPG_SceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _SRPG_SceneMap_update.call(this);
        // SRPG戦闘中でなければ、以下の処理はスキップする
        if (!$gameSystem.isSRPGMode()) return;
        // プレイヤーの移動中は、以下の処理はスキップする
        if ($gameSystem.srpgWaitMoving() === true || $gameTemp.isAutoMoveDestinationValid() === true) return;
        // ターン終了コマンドの実行
        if ($gameTemp.isTurnEndFlag() === true) {
            this.menuActorTurnEnd();
            return;
        }
        // アクターコマンドからの装備変更の後処理
        if ($gameTemp.isSrpgActorEquipFlag() === true) {
            this.srpgAfterActorEquip();
            return;
        }
        // ウィンドウの開閉
        this.srpgWindowOpenClose();
        // イベント実行中は以下の処理をスキップする
        if ($gameMap.isEventRunning() === true) return;
        // 戦闘開始の処理
        if (this._callSrpgBattle === true && this._mapSrpgBattleWindow.isClosed()) {
            this._callSrpgBattle = false;
            SceneManager.push(Scene_Battle);
            return;
        }
        // 戦闘終了後の処理
        if ($gameSystem.isSubBattlePhase() === 'after_battle') {
            this.srpgBattlerDeadAfterBattle();
            this.srpgAfterAction();
            return;
        }
        this.srpgControlPhase(); // 戦闘フェーズの制御
    };

    // 戦闘フェーズの制御
    Scene_Map.prototype.srpgControlPhase = function() {
        // アクターフェイズの開始処理
        if ($gameSystem.isBattlePhase() === 'actor_phase') {
            if ($gameSystem.isSubBattlePhase() === 'initialize') {
                if (!this.isSrpgActorTurnEnd()) {
                    $gameSystem.srpgStartAutoActorTurn(); // 自動行動のアクターが行動する
                    return;
                } else {
                    // autoSave
                    if (this.shouldAutosave()) this.requestAutosave();
                    $gameSystem.setSubBattlePhase('normal');
                    $gameSystem.preloadFaceGraphic(); // 顔グラフィックをプリロードする
                    return;
                }
            } else if ($gameSystem.isSubBattlePhase() === 'normal') {
                if (!this.isSrpgActorTurnEnd()) {
                    $gameSystem.srpgStartAutoActorTurn(); // 自動行動のアクターが行動する
                    return;
                }
            }
        }
        // 自動アクターフェイズの処理
        if ($gameSystem.isBattlePhase() === 'auto_actor_phase') {
            if ($gameSystem.isSubBattlePhase() === 'auto_actor_command') {
                this.srpgInvokeAutoActorCommand();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'auto_actor_move') {
                this.srpgInvokeAutoActorMove();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'auto_actor_action') {
                this.srpgInvokeAutoUnitAction();
                return;
            }
        }
        // エネミーフェイズの処理
        if ($gameSystem.isBattlePhase() === 'enemy_phase') {
            if ($gameSystem.isSubBattlePhase() === 'enemy_command') {
                this.srpgInvokeEnemyCommand();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'enemy_move') {
                this.srpgInvokeEnemyMove();
                return;
            } else if ($gameSystem.isSubBattlePhase() === 'enemy_action') {
                this.srpgInvokeAutoUnitAction();
                return;
            }
        }
    };

    // ウィンドウの開閉
    Scene_Map.prototype.srpgWindowOpenClose = function() {
        // ステータスウィンドウの開閉
        var flag = $gameSystem.srpgStatusWindowNeedRefresh();
        if (flag[0]) {
            if (!this._mapSrpgStatusWindow.isOpen() && !this._mapSrpgStatusWindow.isOpening()) {
                this._mapSrpgStatusWindow.setBattler(flag[1], false);
                this._mapSrpgStatusWindow.open();
            }
        } else {
            if (this._mapSrpgStatusWindow.isOpen() && !this._mapSrpgStatusWindow.isClosing()) {
                this._mapSrpgStatusWindow.clearBattler();
                this._mapSrpgStatusWindow.close();
            }
        }
        // アクターコマンドウィンドウの開閉
        var flag = $gameSystem.srpgActorCommandWindowNeedRefresh();
        if (flag[0]) {
            if (!this._mapSrpgActorCommandWindow.isOpen() && !this._mapSrpgActorCommandWindow.isOpening()) {
                this._mapSrpgActorCommandWindow.setup(flag[1][1]);
            }
        } else {
            if (this._mapSrpgActorCommandWindow.isOpen() && !this._mapSrpgActorCommandWindow.isClosing()) {
                this._mapSrpgActorCommandWindow.close();
                this._mapSrpgActorCommandWindow.deactivate();
            }
        }
        // アクター行動時に画面下部に表示するステータスウィンドウの開閉
        var flag = $gameSystem.srpgActorCommandStatusWindowNeedRefresh();
        if (!flag) flag = [false, null];
        if (flag[0]) {
            if (!this._mapSrpgActorCommandStatusWindow.isOpen() && !this._mapSrpgActorCommandStatusWindow.isOpening()) {
                this._mapSrpgActorCommandStatusWindow.setBattler(flag[1][1]);
            }
        } else {
            if (this._mapSrpgActorCommandStatusWindow.isOpen() && !this._mapSrpgActorCommandStatusWindow.isClosing()) {
                this._mapSrpgActorCommandStatusWindow.clearBattler();
            }
        }
        // 予想ウィンドウ・戦闘開始ウィンドウの開閉
        var flag = $gameSystem.srpgBattleWindowNeedRefresh();
        if (flag[0]) {
            if (_srpgPredictionWindowMode === 3) {
                this.commandBattleStart();
                return;
            }
            if (!this._mapSrpgTargetWindow.isOpen() && !this._mapSrpgTargetWindow.isOpening()) {
                this._mapSrpgTargetWindow.setBattler(flag[2], true);
                this._mapSrpgTargetWindow.open();
            }
            if (!this._mapSrpgPredictionWindow.isOpen() && !this._mapSrpgPredictionWindow.isOpening()) {
                this._mapSrpgPredictionWindow.setBattler(flag[1], flag[2]);
                this._mapSrpgPredictionWindow.open();
            }
            if (!this._mapSrpgBattleWindow.isOpen() && !this._mapSrpgBattleWindow.isOpening()) {
                this._mapSrpgBattleWindow.setup(flag[1]);
            }
        } else {
            if (this._mapSrpgTargetWindow.isOpen() && !this._mapSrpgTargetWindow.isClosing()) {
                this._mapSrpgTargetWindow.clearBattler();
                this._mapSrpgTargetWindow.close();
            }
            if (this._mapSrpgPredictionWindow.isOpen() && !this._mapSrpgPredictionWindow.isClosing()) {
                this._mapSrpgPredictionWindow.clearBattler();
                this._mapSrpgPredictionWindow.close();
            }
            if (this._mapSrpgBattleWindow.isOpen() && !this._mapSrpgBattleWindow.isClosing()) {
                this._mapSrpgBattleWindow.clearActor();
                this._mapSrpgBattleWindow.close();
                this._mapSrpgBattleWindow.deactivate();
            }
        }
    };

    // 戦闘終了後の戦闘不能/復活判定
    Scene_Map.prototype.srpgBattlerDeadAfterBattle = function() {
        var activeBattler = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        var targetBattler = $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1];
        // 行動タイミングと攻撃射程の初期化
        activeBattler.setActionTiming(-1);
        targetBattler.setActionTiming(-1);
        activeBattler.clearSrpgRangeListForBattle();
        targetBattler.clearSrpgRangeListForBattle();
        // 戦闘不能の判定と処理
        if (activeBattler && activeBattler.isDead() && !$gameTemp.activeEvent().isErased()) {
            $gameTemp.activeEvent().erase();
            if (activeBattler.isActor()) {
                var oldValue = $gameVariables.value(_existActorVarID);
                $gameVariables.setValue(_existActorVarID, oldValue - 1);
            } else {
                var oldValue = $gameVariables.value(_existEnemyVarID);
                $gameVariables.setValue(_existEnemyVarID, oldValue - 1);
            }
        }
        if (targetBattler && targetBattler.isDead() && !$gameTemp.targetEvent().isErased()) {
            $gameTemp.targetEvent().erase();
            if (targetBattler.isActor()) {
                var oldValue = $gameVariables.value(_existActorVarID);
                $gameVariables.setValue(_existActorVarID, oldValue - 1);
            } else {
                var oldValue = $gameVariables.value(_existEnemyVarID);
                $gameVariables.setValue(_existEnemyVarID, oldValue - 1);
            }
        }
        // 復活の判定と処理
        if (targetBattler && !targetBattler.isDead() && $gameTemp.targetEvent().isErased()) {
            var event = $gameTemp.targetEvent();
            targetBattler.removeState(targetBattler.deathStateId());
            if (targetBattler.isActor()) {
                var oldValue = $gameVariables.value(_existActorVarID);
                $gameVariables.setValue(_existActorVarID, oldValue + 1);
            } else {
                var oldValue = $gameVariables.value(_existEnemyVarID);
                $gameVariables.setValue(_existEnemyVarID, oldValue + 1);
            }
            var xy = event.makeAppearPoint(event, event.posX(), event.posY(), targetBattler.srpgThroughTag());
            event.locate(xy[0], xy[1]);
            event.appear();
            $gameMap.setEventImages();
        }
    };

    // 行動終了時の処理
    // 戦闘終了の判定はイベントで行う。
    Scene_Map.prototype.srpgAfterAction = function() {
        var battler = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        // 床ダメージの処理
        battler.srpgCheckFloorEffect($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY());
        // 全体アニメーションの単回表示フラグをオフにする（mapBattle時）
        $gameMap.setMapBattleAnimationFlagPos3(false);
        // 行動回数が残っている場合は、行動回数を-1する。残っていない場合はターン終了する
        if (battler.SRPGActionTimes() <= 1) {
            battler.setSrpgTurnEnd(true);
            battler.clearUsedSkill();
        } else {
            battler.useSRPGActionTimes(1);
        }
        // 行動終了時に行う初期化やイベントの処理
        $gameSystem.clearSrpgActorCommandWindowNeedRefresh();
        $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
        $gameTemp.clearMoveTable();
        $gameTemp.clearTargetEvent();
        $gameParty.clearSrpgBattleActors();
        $gameTroop.clearSrpgBattleEnemys();
        if ($gameSystem.isBattlePhase() === 'actor_phase' || $gameSystem.isBattlePhase() === 'auto_actor_phase') {
            this.eventUnitEvent();
        }
        this.eventAfterAction();
        $gameTemp.clearActiveEvent();
        this.passTurnNextUnit(); // 次のユニットのターンにつなげる
    };

    // 次のユニットにターンを回す
    Scene_Map.prototype.passTurnNextUnit = function() {
        if ($gameSystem.isBattlePhase() === 'actor_phase') {
            $gameSystem.setSubBattlePhase('normal');
        } else if ($gameSystem.isBattlePhase() === 'auto_actor_phase') {
            $gameSystem.setSubBattlePhase('auto_actor_command');
        } else if ($gameSystem.isBattlePhase() === 'enemy_phase') {
            $gameSystem.setSubBattlePhase('enemy_command');
        }
    };

    // アクターターン終了の判定
    Scene_Map.prototype.isSrpgActorTurnEnd = function() {
        return $gameMap.events().some(function(event) {
            var battlerArray = $gameSystem.EventToUnit(event.eventId());
            if (battlerArray && battlerArray[0] === 'actor') {
                return battlerArray[1].canInput();
            }
        });
    };

    //----------------------------------------------------------------
    // イベントの実行
    //----------------------------------------------------------------
    // ユニットイベントの実行
    Scene_Map.prototype.eventUnitEvent = function() {
        $gameMap.eventsXy($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()).forEach(function(event) {
            if (event.isType() === 'unitEvent') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
                $gameSystem.pushSearchedItemList([$gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()]);
            }
        });
    };

    // 行動前イベントの実行
    Scene_Map.prototype.eventBeforeBattle = function() {
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'beforeBattle') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
            }
        });
    };

    // 行動後イベントの実行
    Scene_Map.prototype.eventAfterAction = function() {
        $gameMap.events().forEach(function(event) {
            if (event.isType() === 'afterAction') {
                if (event.pageIndex() >= 0) event.start();
                $gameTemp.pushSrpgEventList(event);
            }
        });
    };

    //----------------------------------------------------------------
    // アクターコマンドの処理
    //----------------------------------------------------------------
    // アクターコマンド・攻撃
    Scene_Map.prototype.commandAttack = function() {
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        actor.action(0).setAttack();
        this._deadActorWindow.setBack('null');
        this.startActorTargetting();
    };

    // アクターコマンド・スキル
    Scene_Map.prototype.commandSkill = function() {
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        this._skillWindow.setActor(actor);
        this._skillWindow.setStypeId(this._mapSrpgActorCommandWindow.currentExt());
        this._skillWindow.refresh();
        this._skillWindow.show();
        this._skillWindow.activate();
    };

    // アクターコマンド・アイテム
    Scene_Map.prototype.commandItem = function() {
        this._itemWindow.refresh();
        this._itemWindow.show();
        this._itemWindow.activate();
    };

    // アクターコマンド・装備
    Scene_Map.prototype.commandEquip = function() {
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        $gameParty.setMenuActor(actor);
        SceneManager.push(Scene_Equip);
    };

    // アクターコマンド・待機
    Scene_Map.prototype.commandWait = function() {
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        actor.onAllActionsEnd();
        this.srpgAfterAction();
    };

    // アクターコマンド・オリジナル（指定されたスキルを発動する）
    Scene_Map.prototype.commandOriginal = function() {
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        if (actor.actor().meta.srpgActorCommandOriginalId) {
            actor.action(0).setSkill(Number(actor.actor().meta.srpgActorCommandOriginalId));
        } else {
            actor.action(0).setSkill(_srpgActorCommandOriginalId);
        }
        this._deadActorWindow.setBack('null');
        this.startActorTargetting();
    };

    // アクターコマンド・キャンセル
    Scene_Map.prototype.selectPreviousActorCommand = function() {
        var event = $gameTemp.activeEvent();
        event.locate($gameTemp.originalPos()[0], $gameTemp.originalPos()[1]);
        $gameSystem.clearSrpgActorCommandWindowNeedRefresh();
        $gameSystem.setSubBattlePhase('actor_move');
    };

    //----------------------------------------------------------------
    // スキルコマンドの処理
    //----------------------------------------------------------------
    // スキルコマンド・決定
    Scene_Map.prototype.onSkillOk = function() {
        var skill = this._skillWindow.item();
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        actor.action(0).setSkill(skill.id);
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._deadActorWindow.setBack('skill');
        this.startActorTargetting();
    };

    // スキルコマンド・キャンセル
    Scene_Map.prototype.onSkillCancel = function() {
        this._skillWindow.hide();
        this._skillWindow.deactivate();
        this._mapSrpgActorCommandWindow.activate();
    };

    //----------------------------------------------------------------
    // アイテムコマンドの処理
    //----------------------------------------------------------------
    // アイテムコマンド・決定
    Scene_Map.prototype.onItemOk = function() {
        var item = this._itemWindow.item();
        var actor = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        actor.action(0).setItem(item.id);
        this._itemWindow.hide();
        this._itemWindow.deactivate();
        this._deadActorWindow.setBack('item');
        this.startActorTargetting();
    };

    // アイテムコマンド・キャンセル
    Scene_Map.prototype.onItemCancel = function() {
        this._itemWindow.hide();
        this._itemWindow.deactivate();
        this._mapSrpgActorCommandWindow.activate();
    };

    //----------------------------------------------------------------
    // ターゲット選択の処理
    //----------------------------------------------------------------
    // ターゲットの選択開始
    Scene_Map.prototype.startActorTargetting = function() {
        var battler = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        if (!battler.action(0).isForDeadFriend()) {
            var event = $gameTemp.activeEvent();
            var skill = battler.currentAction().item();
            $gameTemp.clearMoveTable();
            this.skillForAll(battler.action(0).areaType());
            //$gameTemp.initialRangeTable(event.posX(), event.posY(), battler.srpgMove());
            event.makeRangeTable(event.posX(), event.posY(), battler.srpgSkillRange(skill), [0], event.posX(), event.posY(), skill);
            //$gameTemp.minRangeAdapt(event.posX(), event.posY(), battler.srpgSkillMinRange(skill));
            $gameTemp.pushRangeListToMoveList();
            $gameTemp.setResetMoveList(true);
            $gameSystem.clearSrpgActorCommandWindowNeedRefresh();
            $gameSystem.setSubBattlePhase('actor_target');
            if (_srpgSkipTargetForSelf === 'true' && battler.action(0).isForUser()) this.skillForUser();
        } else {
            this._deadActorWindow.refresh();
            this._deadActorWindow.show();
            this._deadActorWindow.activate();
        }
    };

    // 対象が自分自身で、プラグインパラメータで設定されている時は対象の選択の処理をスキップする
    Scene_Map.prototype.skillForUser = function() {
        var event = $gameTemp.activeEvent();
        var actionBattlerArray = $gameSystem.EventToUnit(event.eventId());
        var targetBattlerArray = $gameSystem.EventToUnit(event.eventId());
        SoundManager.playOk();
        $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
        if (_srpgPredictionWindowMode !== 3) $gameSystem.setSrpgStatusWindowNeedRefresh(actionBattlerArray);
        $gameSystem.setSrpgBattleWindowNeedRefresh(actionBattlerArray, targetBattlerArray);
        $gameTemp.setSrpgDistance($gameSystem.unitDistance(event, event));
        $gameTemp.setTargetEvent(event);
        $gameSystem.setSubBattlePhase('battle_window');
    };

    // 全体スキル（射程内の全actor or enemyをtargetとする）の場合、フラグを返す
    Scene_Map.prototype.skillForAll = function(areaType) {
		if (areaType === 'allactor' || areaType === 'allenemy') {
			$gameTemp.setSrpgAllTargetInRange(true);
		} else {
            $gameTemp.setSrpgAllTargetInRange(false);
        }
    };

    //----------------------------------------------------------------
    // 戦闘不能アクターの選択の処理
    //----------------------------------------------------------------
    // 決定時
    Scene_Map.prototype.onDeadActorOk = function() {
        if ($gameParty.targetActor().isDead()) {
            SoundManager.playOk();
            this._deadActorWindow.hide();
            this._deadActorWindow.deactivate();
            var event1 = $gameTemp.activeEvent();
            var event2 = $gameMap.event($gameSystem.ActorToEvent($gameParty.targetActor().actorId()));
            var actionBattlerArray = $gameSystem.EventToUnit(event1.eventId());
            var targetBattlerArray = $gameSystem.EventToUnit(event2.eventId());
            var user = actionBattlerArray[1];
            var skill = user.currentAction().item();
            $gameTemp.clearMoveTable();
            //$gameTemp.initialRangeTable(event1.posX(), event1.posY(), user.srpgMove());
            event1.makeRangeTable(event1.posX(), event1.posY(), user.srpgSkillRange(skill), [0], event1.posX(), event1.posY(), skill);
            //$gameTemp.minRangeAdapt(event1.posX(), event1.posY(), user.srpgSkillMinRange(skill));
            $gameTemp.pushRangeListToMoveList();
            $gameTemp.setResetMoveList(true);
            event2.locate(event1.posX(), event1.posY());
            var xy = event2.makeAppearPoint(event2, event2.posX(), event2.posY(), targetBattlerArray[1].srpgThroughTag());
            event2.locate(xy[0], xy[1]);
            $gameSystem.clearSrpgActorCommandWindowNeedRefresh();  
            $gameSystem.clearSrpgActorCommandStatusWindowNeedRefresh();
            if (_srpgPredictionWindowMode !== 3) $gameSystem.setSrpgStatusWindowNeedRefresh(actionBattlerArray);
            $gameSystem.setSrpgBattleWindowNeedRefresh(actionBattlerArray, targetBattlerArray);
            $gameTemp.setSrpgDistance(0);
            $gameTemp.setTargetEvent(event2);
            $gameSystem.setSubBattlePhase('battle_window');
        } else {
            SoundManager.playBuzzer();
        }
    };

    // キャンセル時
    Scene_Map.prototype.onDeadActorCancel = function() {
        SoundManager.playCancel();
        this._deadActorWindow.hide();
        this._deadActorWindow.deactivate();
        if (this._deadActorWindow.backWindow() === 'skill') {
            this._skillWindow.refresh();
            this._skillWindow.show();
            this._skillWindow.activate();
        } else if (this._deadActorWindow.backWindow() === 'item') {
            this._itemWindow.refresh();
            this._itemWindow.show();
            this._itemWindow.activate();
        } else {
            this._mapSrpgActorCommandWindow.activate();
        }
        // AoEの消去
        $gameTemp.clearArea();
        $gameTemp.clearAreaTargets();
    };

    //----------------------------------------------------------------
    // 戦闘開始コマンドの処理
    //----------------------------------------------------------------
    // 戦闘開始コマンド・戦闘開始
    Scene_Map.prototype.commandBattleStart = function() {
        var actionArray = $gameSystem.srpgBattleWindowNeedRefresh()[1];
        var targetArray = $gameSystem.srpgBattleWindowNeedRefresh()[2];
        $gameSystem.clearSrpgStatusWindowNeedRefresh();
        $gameSystem.clearSrpgBattleWindowNeedRefresh();
        $gameSystem.setSubBattlePhase('invoke_action');
        this.srpgBattleStart(actionArray, targetArray);
    };

    // 戦闘開始コマンド・キャンセル
    Scene_Map.prototype.selectPreviousSrpgBattleStart = function() {
        var activeBattlerArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
        var activeBattler = activeBattlerArray[1];
        var targetBattler = $gameSystem.EventToUnit($gameTemp.targetEvent().eventId())[1];
        // ウィンドウの内容の初期化
        $gameSystem.clearSrpgStatusWindowNeedRefresh();
        $gameSystem.clearSrpgBattleWindowNeedRefresh();
        $gameSystem.setSrpgActorCommandStatusWindowNeedRefresh(activeBattlerArray);
        if (activeBattler !== targetBattler) {
            // actionの初期化
            targetBattler.clearActions();
            // 行動タイミングと攻撃射程の初期化
            targetBattler.setActionTiming(-1);
            targetBattler.clearSrpgRangeListForBattle();
        }
        activeBattler.setActionTiming(-1);
        activeBattler.clearSrpgRangeListForBattle();
        // 距離とターゲットの初期化
        $gameTemp.setSrpgDistance(0);
        $gameTemp.clearTargetEvent();
        // ターゲット選択に戻す
        $gameSystem.setSubBattlePhase('actor_target');
        // 対象が自分自身で、プラグインパラメータで設定されている時はアクターコマンドまで戻す
        // 対象が戦闘不能のスキルの場合もアクターコマンドまで戻す
        if ((_srpgSkipTargetForSelf === 'true' && activeBattler.action(0).isForUser()) ||
            activeBattler.action(0).isForDeadFriend()) {
            $gameSystem.srpgMakeMoveTableOriginalPos($gameTemp.activeEvent());
            $gameTemp.setResetMoveList(true);
            $gameSystem.setSrpgActorCommandWindowNeedRefresh(activeBattlerArray);
            $gameSystem.setSubBattlePhase('actor_command_window');
        }
    };

    //----------------------------------------------------------------
    // メニュー
    //----------------------------------------------------------------
    // メニューからのターン終了処理
    Scene_Map.prototype.menuActorTurnEnd = function() {
        for (var i = 1; i <= $gameMap.isMaxEventId(); i++) {
            var event = $gameMap.event(i);
            if (event && event.isType() === 'actor') {
                var actor = $gameSystem.EventToUnit(event.eventId());
                if (actor && actor[1] && actor[1].canInput() == true && !actor[1].srpgTurnEnd()) {
                    if ($gameTemp.isAutoBattleFlag() == true) {
                        actor[1].addState(_srpgAutoBattleStateId);
                    } else {
                        $gameTemp.setActiveEvent(event);
                        actor[1].onAllActionsEnd();
                        actor[1].useSRPGActionTimes(99);
                        this.srpgAfterAction();
                    }
                }
            }
        }
        $gameTemp.setAutoBattleFlag(false);
        this.passTurnNextUnit(); // 次のユニットのターンにつなげる
        $gameTemp.setTurnEndFlag(false); // 処理終了
        return;
    };

    // アクターコマンドからの装備変更の後処理
    Scene_Map.prototype.srpgAfterActorEquip = function() {
        var event = $gameTemp.activeEvent();
        $gameSystem.srpgMakeMoveTableOriginalPos(event);
        $gameTemp.setResetMoveList(true);
        $gameTemp.setSrpgActorEquipFlag(false); // 処理終了
        return;
    };

    //----------------------------------------------------------------
    // 自動行動アクターの行動に関する処理
    //----------------------------------------------------------------
    // 自動行動アクターの行動決定
    Scene_Map.prototype.srpgInvokeAutoActorCommand = function() {
        // 未行動の自動行動アクターを選択する
        for (var i = 1; i <= $gameMap.isMaxEventId() + 1; i++) {
            var event = $gameMap.event(i);
            if (event && event.isType() === 'actor') {
                var actorArray = $gameSystem.EventToUnit(event.eventId());
                if (actorArray) {
                    var actor = actorArray[1];
                    if (actor && actor.canMove() === true && !actor.srpgTurnEnd()) {
                        break;
                    }
                }
            }
            // 行動可能な自動行動アクターがいない場合は、エネミーターンを開始する
            if (i > $gameMap.isMaxEventId()) {
                $gameSystem.srpgStartEnemyTurn(); // エネミーターンの開始
                return;
            }
        }
        // mode:standの場合、行動開始するか判定する（通常攻撃の範囲内に対立ユニットがいるか）
        if (actor.battleMode() === 'stand') {
            actor.setActionAttack();
            var targetType = this.makeTargetType(actor, 'actor');
            $gameTemp.setActiveEvent(event);
            $gameSystem.srpgMakeMoveTable(event);
            var canAttackTargets = this.srpgMakeCanAttackTargets(actor, targetType); // 行動対象としうるユニットのリストを作成
            $gameTemp.clearMoveTable();
            if (canAttackTargets.length > 0 || actor.hpRate() < 1.0) {
                actor.setBattleMode('normal');
            } else {
                $gameTemp.setActiveEvent(event);
                actor.onAllActionsEnd();
                this.srpgAfterAction();
                return;
            }
        }
        // 行動を設定する
        actor.makeActions();
        if (actor.isConfused()) actor.makeConfusionActions();
        if (actor.action(0).item()) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination(event.posX(), event.posY());
            $gameTemp.setActiveEvent(event);
            $gameSystem.setSubBattlePhase('auto_actor_move');
        } else {
            $gameTemp.setActiveEvent(event);
            actor.onAllActionsEnd();
            this.srpgAfterAction();
        }
    };

    //自動行動アクターの移動先決定と移動実行
    Scene_Map.prototype.srpgInvokeAutoActorMove = function() {
        var event = $gameTemp.activeEvent();
        var type = $gameSystem.EventToUnit(event.eventId())[0];
        var actor = $gameSystem.EventToUnit(event.eventId())[1];
        var targetType = this.makeTargetType(actor, type);
        // 移動範囲＋射程範囲の作成
        $gameTemp.setSrpgMoveTileInvisible(true);
        $gameSystem.srpgMakeMoveTable(event);
        // 優先ターゲットの設定
        this.srpgPriorityTarget(actor); 
        // 行動対象としうるユニットのリストを作成
        var canAttackTargets = this.srpgMakeCanAttackTargets(actor, targetType); 
        // 代替スキルの検討
        var alternativeArray = this.checkAlternativeSkill(event, type, actor, targetType, canAttackTargets);
        targetType = alternativeArray[0];
        canAttackTargets = alternativeArray[1];
        // 行動対象としうるユニットがいる場合
        if (canAttackTargets.length > 0 ||
            (actor.battleMode() === 'absRegionUp' || actor.battleMode() === 'absRegionDown' ||
            actor.battleMode() === 'regionUp' || actor.battleMode() === 'regionDown')) {
            // ターゲットの設定
            var targetEvent = this.srpgDecideTarget(canAttackTargets, event, targetType);
            $gameTemp.setTargetEvent(targetEvent);
            // 最適移動位置の探索
            var optimalPos = this.srpgSearchOptimalPos(targetEvent, actor, type);
            // 移動ルートの設定
            var route = $gameTemp.MoveTable(optimalPos[0], optimalPos[1])[1];
        } else {
            // 行動対象としうるユニットがいない場合、遠距離・最短距離の相手を探索する
            canAttackTargets = this.srpgMakeCanAttackTargetsFromBestSearchRoute(event, actor, targetType);
            // ターゲットの設定
            var targetEvent = this.srpgDecideTarget(canAttackTargets, event, targetType);
            $gameTemp.setTargetEvent(targetEvent);
            // 最適移動位置の探索
            var optimalPos = this.srpgSearchOptimalPos(targetEvent, actor, type);
            // 移動ルートの設定
            var route = $gameTemp.MoveTable(optimalPos[0], optimalPos[1])[1];
            // 遠距離の相手への探索が行われている場合、移動可能な距離の分だけsliceして移動先を計算する
            route = this.srpgSliceSearchRoute(actor, route);
            // 移動＋射程範囲を再設定する
            $gameSystem.srpgMakeMoveTable(event);
        }
        // ユニットの移動
        $gameTemp.setSrpgMoveTileInvisible(false);
        $gameSystem.setSrpgWaitMoving(true);
        event.srpgMoveRouteForce(route);
        actor.setMovedStep(route.length - 1);
        // 行動へ移る
        $gameSystem.setSubBattlePhase('auto_actor_action');
    };

    //----------------------------------------------------------------
    // エネミーの行動に関する処理
    //----------------------------------------------------------------
    //エネミーの行動決定
    Scene_Map.prototype.srpgInvokeEnemyCommand = function() {
        // 未行動のエネミーを選択する
        for (var i = 1; i <= $gameMap.isMaxEventId() + 1; i++) {
            var event = $gameMap.event(i);
            if (event && event.isType() === 'enemy') {
                var enemy = $gameSystem.EventToUnit(event.eventId())[1];
                if (enemy.canMove() == true && !enemy.srpgTurnEnd()) {
                    break;
                }
            }
            // 行動可能なエネミーがいない場合、ターン終了する
            if (i > $gameMap.isMaxEventId()) {
                $gameSystem.srpgTurnEnd(); // ターンを終了する
                return;
            }
        }
        // mode:standの場合、行動開始するか判定する（通常攻撃の範囲内に対立ユニットがいるか）
        if (enemy.battleMode() === 'stand') {
            enemy.setActionAttack();
            var targetType = this.makeTargetType(enemy, 'enemy');
            $gameTemp.setActiveEvent(event);
            $gameSystem.srpgMakeMoveTable(event);
            var canAttackTargets = this.srpgMakeCanAttackTargets(enemy, targetType); // 行動対象としうるユニットのリストを作成
            $gameTemp.clearMoveTable();
            if (canAttackTargets.length > 0 || enemy.hpRate < 1.0) {
                enemy.setBattleMode('normal');
            } else {
                $gameTemp.setActiveEvent(event);
                enemy.onAllActionsEnd();
                this.srpgAfterAction();
                return;
            }
        }
        // 行動を設定する
        enemy.makeSrpgActions();
        if (enemy.action(0).item()) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination(event.posX(), event.posY());
            $gameTemp.setActiveEvent(event);
            $gameSystem.setSubBattlePhase('enemy_move');
        } else {
            $gameTemp.setActiveEvent(event);
            enemy.onAllActionsEnd();
            this.srpgAfterAction();
        }
    };

    // エネミーの移動先決定と移動実行
    Scene_Map.prototype.srpgInvokeEnemyMove = function() {
        var event = $gameTemp.activeEvent();
        var type = $gameSystem.EventToUnit(event.eventId())[0];
        var enemy = $gameSystem.EventToUnit(event.eventId())[1];
        // 移動範囲＋射程範囲の作成
        $gameTemp.setSrpgMoveTileInvisible(true);
        $gameSystem.srpgMakeMoveTable(event);
        // 優先ターゲットの設定
        this.srpgPriorityTarget(enemy); 
        // 行動対象としうるユニットのリストを作成
        var targetType = this.makeTargetType(enemy, type);
        var canAttackTargets = this.srpgMakeCanAttackTargets(enemy, targetType); 
        // 代替スキルの検討
        var alternativeArray = this.checkAlternativeSkill(event, type, enemy, targetType, canAttackTargets);
        targetType = alternativeArray[0];
        canAttackTargets = alternativeArray[1];
        // 行動対象としうるユニットがいる場合 または regionを用いて移動先を決める場合
        if (canAttackTargets.length > 0 ||
            (enemy.battleMode() === 'absRegionUp' || enemy.battleMode() === 'absRegionDown' ||
            enemy.battleMode() === 'regionUp' || enemy.battleMode() === 'regionDown')) {
            // ターゲットの設定
            var targetEvent = this.srpgDecideTarget(canAttackTargets, event, targetType);
            $gameTemp.setTargetEvent(targetEvent);
            // 最適移動位置の探索
            var optimalPos = this.srpgSearchOptimalPos(targetEvent, enemy, type);
            // 移動ルートの設定
            var route = $gameTemp.MoveTable(optimalPos[0], optimalPos[1])[1];
        } else {
            // 行動対象としうるユニットがいない場合、遠距離・最短距離の相手を探索する
            canAttackTargets = this.srpgMakeCanAttackTargetsFromBestSearchRoute(event, enemy, targetType);
            // ターゲットの設定
            var targetEvent = this.srpgDecideTarget(canAttackTargets, event, targetType);
            $gameTemp.setTargetEvent(targetEvent);
            // 最適移動位置の探索
            var optimalPos = this.srpgSearchOptimalPos(targetEvent, enemy, type);
            // 移動ルートの設定
            var route = $gameTemp.MoveTable(optimalPos[0], optimalPos[1])[1];
            // 遠距離の相手への探索が行われている場合、移動可能な距離の分だけsliceして移動先を計算する
            route = this.srpgSliceSearchRoute(enemy, route);
            // 移動＋射程範囲を再設定する
            $gameSystem.srpgMakeMoveTable(event);
        }
        // ユニットの移動
        $gameTemp.setSrpgMoveTileInvisible(false);
        $gameSystem.setSrpgWaitMoving(true);
        event.srpgMoveRouteForce(route);
        enemy.setMovedStep(route.length - 1);
        // 行動へ移る
        $gameSystem.setSubBattlePhase('enemy_action');
    };

    //----------------------------------------------------------------
    // 自動行動アクター・エネミー共通で用いる行動に関する処理
    //----------------------------------------------------------------
    // 行動対象とするユニットのタイプを返す
    Scene_Map.prototype.makeTargetType = function(battler, type) {
        if (battler.isConfused() === true) {
            switch (battler.confusionLevel()) {
            case 1:
                if (type === 'enemy') return 'actor';
                else if (type === 'actor') return 'enemy';
            case 2:
                if (Math.randomInt(2) === 0) {
                    if (type === 'enemy') return 'actor';
                    else if (type === 'actor') return 'enemy';
                } else {
                    if (type === 'enemy') return 'enemy';
                    else if (type === 'actor') return 'actor';
                }
            default:
                if (type === 'enemy') return 'enemy';
                else if (type === 'actor') return 'actor';
            }
        }
        if (type === 'enemy' && battler.currentAction().isForOpponent()) {
            return 'actor';
        } else if (type === 'enemy' && battler.currentAction().isForFriend()) {
            return 'enemy';
        } else if (type === 'actor' && battler.currentAction().isForOpponent()) {
            return 'enemy';
        } else if (type === 'actor' && battler.currentAction().isForFriend()) {
            return 'actor';
        }
    };

     // 優先ターゲットの決定（aimingEvent、aimingActorで使用）
    Scene_Map.prototype.srpgPriorityTarget = function(battler) {
        var event = null;
        if (battler.battleMode() === 'aimingEvent') {
            event = $gameMap.event(battler.targetId());
        } else if (battler.battleMode() === 'aimingActor') {
            var eventId1 = $gameSystem.ActorToEvent(battler.targetId());
            event = $gameMap.event(eventId1);
        }
        // ターゲットにしたeventが有効でない場合、優先ターゲットは設定しない
        if (event) { 
            var targetBattlerArray = $gameSystem.EventToUnit(event.eventId());
            // 優先ターゲットが失われている場合、優先ターゲットは設定しない
            if (!(targetBattlerArray && targetBattlerArray[1].isAlive())) event = null;
        } else {
            event = null;
        }
        $gameTemp.setSrpgPriorityTarget(event);
    };

    // 移動力と射程を足した範囲内にいる対象をリストアップする
    Scene_Map.prototype.srpgMakeCanAttackTargets = function(battler, targetType) {
        var moveRangeList = $gameTemp.moveList();
        var targetList = [];
        // 対象：使用者であれば、自分だけを対象に加える
        if (battler.currentAction().isForUser()) {
            targetList.push($gameTemp.activeEvent());
            return targetList;
        }
        // 移動・射程範囲内にいるイベントを呼び出し、条件が合っていれば対象に加える
        for (var i = 0; i < moveRangeList.length; i++) {
            var pos =  moveRangeList[i];
            var events = $gameMap.eventsXyNt(pos[0], pos[1]);
            for (var j = 0; j < events.length; j++) {
                var event = events[j];
                // 対象がターゲットタイプと一致する＆消去されていない＆まだリストに含まれていない
                if (event.isType() === targetType && !event.isErased() && targetList.indexOf(event) < 0) {
                    var target = $gameSystem.EventToUnit(event.eventId())[1];
                    // 優先ターゲットが設定されている場合
                    if ($gameTemp.isSrpgPriorityTarget()) {
                        if ($gameTemp.isSrpgPriorityTarget() === event) targetList.push(event);
                    // それ以外の場合
                    } else {
                        // HP回復スキルで対象のHPが満タンの場合は、ターゲットに加えない
                        if (battler.currentAction().isHpRecover() && target.hpRate() == 1.0) continue;
                        targetList.push(event);
                    }
                }
            }
        }
        return targetList;
    };

    // 攻撃可能な相手がいない場合、遠距離・最短距離の相手を探索する
    Scene_Map.prototype.srpgMakeCanAttackTargetsFromBestSearchRoute = function(activeEvent, battler, targetType) {
        var canAttackTargets = [];
        // 遠距離の相手を探索する場合
        if (_srpgBestSearchRouteSize > 0) {
            $gameTemp.setSrpgSearchLongDistance(true);
            $gameSystem.srpgMakeMoveTable(activeEvent);
            canAttackTargets = this.srpgMakeCanAttackTargets(battler, targetType);
            $gameTemp.setSrpgSearchLongDistance(false);
        }
        // 探索をしない、または探索してもターゲットがいない場合、最短距離の相手を探索する
        if (canAttackTargets.length === 0) {
            var minDis = 9999;
            var events = $gameMap.events();
            for (var i = 0; i <  events.length; i++) {
                var event = events[i];
                if (event.isType() === targetType && !event.isErased() && activeEvent !== event) {
                    var dis = $gameSystem.unitDistance(activeEvent, event);
                    if (dis === minDis) {
                        canAttackTargets.push(event);
                    } else if (dis < minDis) {
                        minDis = dis;
                        canAttackTargets = [];
                        canAttackTargets.push(event);
                    }
                }
            }
        }
        return canAttackTargets;
    };

    // 代替スキルの検討と決定
    Scene_Map.prototype.checkAlternativeSkill = function(event, type, battler, targetType, canAttackTargets) {
        var action = battler.currentAction();
        // HP回復スキルで対象がいない、戦闘不能回復スキル、簡易AIで使用しないの場合
        if ((action.isHpRecover() && canAttackTargets.length === 0) ||
            action.isForDeadFriend() ||
            battler.isAIDoNotUse(action.item()) === true) {
            // 代替スキルの設定
            action.setSkill(battler.srpgAlternativeSkillId());
            // 移動範囲＋射程範囲の作成
            $gameSystem.srpgMakeMoveTable(event);
            // 行動対象としうるユニットのリストを作成
            targetType = this.makeTargetType(battler, type);
            canAttackTargets = this.srpgMakeCanAttackTargets(battler, targetType); 
        }
        return [targetType, canAttackTargets];
    };

    // ターゲットの決定
    Scene_Map.prototype.srpgDecideTarget = function(canAttackTargets, activeEvent, targetType) {
        var targetEvent = null;
        // HP回復スキルの場合、最もHP割合が低い相手を選ぶ
        var user = $gameSystem.EventToUnit(activeEvent.eventId())[1];
        if (user.currentAction().isRecover()) {
            var lowerHpUnit = [];
            var lowerHpRate = 999;
            canAttackTargets.forEach(function(event) {
                var battler = $gameSystem.EventToUnit(event.eventId())[1];
                if (battler.hpRate() === lowerHpRate) {
                    lowerHpUnit.push(event);
                } else if (battler.hpRate() < lowerHpRate) {
                    lowerHpUnit = [];
                    lowerHpUnit.push(event);
                    lowerHpRate = battler.hpRate();
                }
            });
            if (lowerHpUnit.length > 0) {
                targetEvent = lowerHpUnit[Math.randomInt(lowerHpUnit.length)];
                return targetEvent;
            }
        }
        // 攻撃対象としうる相手がいる場合、狙われ率をもとに対象を決める
        var sum = canAttackTargets.reduce(function(r, event) {
            var battler = $gameSystem.EventToUnit(event.eventId())[1];
            return r + battler.tgr;
        }, 0);
        var tgrRand = Math.random() * sum;
        canAttackTargets.forEach(function(event) {
            var battler = $gameSystem.EventToUnit(event.eventId())[1];
            tgrRand -= battler.tgr;
            if (tgrRand <= 0 && !targetEvent) {
                targetEvent = event;
            }
        });
        return targetEvent;
    };

    // 最適移動位置の探索
    Scene_Map.prototype.srpgSearchOptimalPos = function(targetEvent, battler, type) {
        // 移動位置の探索
        var list = $gameTemp.moveList();
        var skill = battler.currentAction().item();
        var range = battler.srpgSkillRange(skill);
        var minRange = battler.srpgSkillMinRange(skill);
        var candidatePos = [];
        var optimalDis = -9999;
        var optimalResion = $gameMap.regionId($gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY());
        var searchItem = battler.searchItem();
        // ターゲットが存在しない、または自分自身がターゲット、またはregionに応じた移動を優先する、または射程無制限スキルの場合
        if ($gameTemp.activeEvent() === targetEvent || !targetEvent ||
            battler.battleMode() === 'absRegionUp' || battler.battleMode() === 'absRegionDown' ||
            skill.meta.specialRange === 'allActor' || skill.meta.specialRange === 'allEnemy') {
            // battleModeに応じて処理する
            switch (battler.battleMode()) { 
            case 'regionUp' :
            case 'absRegionUp' :
                for (var i = 0; i < list.length; i++) {
                    var pos = list[i];
                    if ($gameMap.regionId(pos[0], pos[1]) >= optimalResion) {
                        optimalResion = $gameMap.regionId(pos[0], pos[1]);
                        candidatePos.push([pos[0], pos[1]]);
                    }
                }
            case 'regionDown' :
            case 'absRegionDown' :
                for (var i = 0; i < list.length; i++) {
                    var pos = list[i];
                    if ($gameMap.regionId(pos[0], pos[1]) <= optimalResion) {
                        optimalResion = $gameMap.regionId(pos[0], pos[1]);
                        candidatePos.push([pos[0], pos[1]]);
                    }
                }
            default :
                candidatePos.push([$gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()]);
            }
            // アイテムサーチの場合
            if (searchItem) candidatePos = this.srpgSearchItemPos(list, candidatePos); 
            return candidatePos[Math.randomInt(candidatePos.length)];
        }
        // targetが存在する場合
        for (var i = 0; i < list.length; i++) {
            var pos = list[i];
            if (pos[2] === false && $gameSystem.areTheyNoUnits(pos[0], pos[1])) {
                var dis = this.srpgCalculateCandidatePosDis(pos, targetEvent);
                var check = range - dis;
                var specialRange = $gameTemp.activeEvent().srpgRangeExtention(targetEvent.posX(), targetEvent.posY(), pos[0], pos[1], skill, range);
                // checkが 0 になる地点＝射程と距離が一致する地点を目指して探索する
                //
                // 探索する座標までの距離＝最適移動位置までの距離　かつ　特殊射程を満たす場合
                // 最適移動位置のリストに座標を追加する
                if (check === optimalDis && specialRange === true) {
                    candidatePos.push([pos[0], pos[1]]);
                // 探索する座標までの距離＝射程　かつ　最低射程・特殊射程を満たす場合
                // 新規の最適移動位置として座標を追加する
                } else if (check === 0 && minRange <= dis && specialRange == true) {
                    searchItem = false;
                    candidatePos = [];
                    optimalDis = check;
                    candidatePos.push([pos[0], pos[1]]);
                // 探索する座標までの距離＜射程　かつ　既存の移動位置よりcheck = 0 に近い　かつ　最低射程・特殊射程を満たす場合
                // 新規の移動位置として座標を追加する
                } else if ((check > 0 && optimalDis > 0) && check < optimalDis && minRange <= dis && specialRange == true) {
                    candidatePos = [];
                    optimalDis = check;
                    candidatePos.push([pos[0], pos[1]]);
                // 探索する座標までの距離＜射程　かつ　既存の移動位置が射程外　かつ　最低射程・特殊射程を満たす場合
                // 新規の移動位置として座標を追加する
                } else if (check > 0 && optimalDis < 0 && minRange <= dis && specialRange == true) {
                    candidatePos = [];
                    optimalDis = check;
                    candidatePos.push([pos[0], pos[1]]);
                // 探索する座標までの距離＞射程　かつ　既存の移動位置が射程外　かつ　既存の移動位置よりcheck = 0 に近い場合
                // battleModeに応じて処理する
                } else if ((check < 0 && optimalDis < 0) && check > optimalDis) {
                    switch (battler.battleMode()) { 
                    case 'normal' :
                    case 'aimingEvent' :
                    case 'aimingActor' :
                        candidatePos = [];
                        optimalDis = check;
                        candidatePos.push([pos[0], pos[1]]);
                        break;
                    case 'stand' :
                        candidatePos = [];
                        candidatePos.push([$gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()]);
                        break;
                    case 'regionUp' : 
                        if ($gameMap.regionId(pos[0], pos[1]) >= optimalResion) {
                            candidatePos = [];
                            optimalResion = $gameMap.regionId(pos[0], pos[1]);
                            candidatePos.push([pos[0], pos[1]]);
                        }
                        break;
                    case 'regionDown' : 
                        if ($gameMap.regionId(pos[0], pos[1]) >= optimalResion) {
                            candidatePos = [];
                            optimalResion = $gameMap.regionId(pos[0], pos[1]);
                            candidatePos.push([pos[0], pos[1]]);
                        }   
                        break;
                    default :
                        candidatePos = [];
                        optimalDis = check;
                        candidatePos.push([pos[0], pos[1]]);
                        break;
                    }
                }
            }
        }   
        // 最適移動位置が空の場合、移動しない
        if (candidatePos.length === 0) {
            candidatePos.push([$gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()]);
        }
        // アイテムサーチの場合
        if (searchItem) candidatePos = this.srpgSearchItemPos(list, candidatePos); 
        return candidatePos[Math.randomInt(candidatePos.length)];
    };

    // 距離の計算
    Scene_Map.prototype.srpgCalculateCandidatePosDis = function(pos, targetEvent) {
        var minDisX = Math.abs(pos[0] - targetEvent.posX());
        var minDisY = Math.abs(pos[1] - targetEvent.posY());
        if ($gameMap.isLoopHorizontal() === true) {
            var pos0X = pos[0] > targetEvent.posX() ? pos[0] - $gameMap.width() : pos[0] + $gameMap.width();
            var disX = Math.abs(pos0X - targetEvent.posX());
            minDisX = minDisX < disX ? minDisX : disX;
        }
        if ($gameMap.isLoopVertical() === true) {
            var pos1Y = pos[1] > targetEvent.posY() ? pos[1] - $gameMap.height() : pos[1] + $gameMap.height();
            var disY = Math.abs(pos1Y - targetEvent.posY());
            minDisY = minDisY < disY ? minDisY : disY;
        }
        return minDisX + minDisY;
    };

    // アイテムサーチの処理
    Scene_Map.prototype.srpgSearchItemPos = function(list, candidatePos) {
        //（最適な行動位置(check === optimalDis)がある場合は飛ばす）
        // また、誰か一人でも一度行った場所にはいかない
        for (var i = 0; i < list.length; i++) {
            var pos = list[i];
            if (pos[2] === false && $gameSystem.areTheyNoUnits(pos[0], pos[1])) {
                if ($gameSystem.isThereEventUnit(pos[0], pos[1]) && $gameSystem.indexOfSearchedItemList([pos[0], pos[1]]) < 0) {
                    candidatePos = [];
                    candidatePos.push([pos[0], pos[1]]);
                }
            }
        }
        return candidatePos
    };

    // 遠距離の相手への探索が行われている場合、最も移動できる位置を最適移動位置として返す
    Scene_Map.prototype.srpgSliceSearchRoute = function(battler, route) {
        var length = route.length;
        for (var i = 0; i < length; i++) {
            // 移動力より長い部分をカットする
            if (route.length > battler.srpgMove() + 1) {
                route.pop();
                continue;
            }
            // 移動先の座標を計算する
            var pos = [$gameTemp.activeEvent().posX(), $gameTemp.activeEvent().posY()];
            for (var j = 0; j < route.length; j++) {
                var d = route[j];
                if (d === 2) pos[1] += 1;
                else if (d === 4) pos[0] -= 1;
                else if (d === 6) pos[0] += 1;
                else if (d === 8) pos[1] -= 1;
            }
            // ループマップへの対応
            if (pos[0] < 0) pos[0] += $gameMap.width();
            else if (pos[0] >= $gameMap.width()) pos[0] -= $gameMap.width();
            if (pos[1] < 0) pos[1] += $gameMap.height();
            else if (pos[1] >= $gameMap.height()) pos[1] -= $gameMap.height();
            // 移動先が空いていれば確定、別のユニットがいれば１つ手前で再試行する
            if ($gameSystem.areTheyNoUnits(pos[0], pos[1])) {
                break;
            } else {
                route.pop();
            }
        }
        return route;
    };

    //----------------------------------------------------------------
    // 戦闘シーンの実行に関する処理
    //----------------------------------------------------------------
    // 戦闘シーン処理の開始
    Scene_Map.prototype.srpgBattleStart = function(actionArray, targetArray) {
        // 戦闘シーンのセッティング
        $gameSystem.setupSrpgBattleScene(actionArray, targetArray);
        // 応戦が反撃率に応じる場合、応戦できるか確率判定する
        if (_srpgBattleReaction === 2 && targetArray[1].cnt > 0) {
            if (Math.random() >= targetArray[1].cnt) targetArray[1].clearActions();
        }
        // イベントの向きを補正する
        this.preBattleSetDirection();
        // 使用したスキルのリストに加える
        actionArray[1].setUsedSkill(actionArray[1].currentAction().item().id);
        // 行動回数追加スキルなら行動回数を追加する
        var addActionNum = Number(actionArray[1].currentAction().item().meta.addActionTimes);
        if (addActionNum && addActionNum > 0) {
            actionArray[1].SRPGActionTimesAdd(addActionNum);
        }
        // 戦闘開始フラグを立て、戦闘開始前イベントを実行する
        this._callSrpgBattle = true;
        this.eventBeforeBattle();
    };

    // 自動行動アクター・エネミーの戦闘シーンの実行
    Scene_Map.prototype.srpgInvokeAutoUnitAction = function() {
        // ターゲットが存在しない場合、行動終了する
        if (!$gameTemp.targetEvent()) {
            var actionArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
            actionArray[1].onAllActionsEnd();
            this.srpgAfterAction();
            return;
        }
        // battlerArrayの設定
        var actionArray = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId());
        var targetArray = $gameSystem.EventToUnit($gameTemp.targetEvent().eventId());
        // 戦闘シーンのセッティング
        $gameSystem.setupSrpgBattleScene(actionArray, targetArray);
        var skill = actionArray[1].currentAction().item();
        // 射程を表示する
        var event = $gameTemp.activeEvent();
        $gameTemp.clearMoveTable();
        this.skillForAll(actionArray[1].currentAction().areaType());
        event.makeRangeTable(event.posX(), event.posY(), actionArray[1].srpgSkillRange(skill), [0], event.posX(), event.posY(), skill);
        $gameTemp.pushRangeListToMoveList();
        $gameTemp.setResetMoveList(true);
        // skillが使用可能なら戦闘シーンに移る
        if (actionArray[1].canUse(skill)) {
            $gameTemp.setAutoMoveDestinationValid(true);
            $gameTemp.setAutoMoveDestination($gameTemp.targetEvent().posX(), $gameTemp.targetEvent().posY());
            $gameSystem.setSubBattlePhase('invoke_action');
            this.srpgBattleStart(actionArray, targetArray);
        } else {
            // skillが使用できなければ、行動を初期化して行動終了する
            // actionの初期化
            targetArray[1].clearActions();
            // 行動タイミングと攻撃射程の初期化
            actionArray[1].setActionTiming(-1);
            targetArray[1].setActionTiming(-1);
            actionArray[1].clearSrpgRangeListForBattle();
            targetArray[1].clearSrpgRangeListForBattle();
            // 対象と距離の初期化
            $gameTemp.clearTargetEvent();
            $gameTemp.setSrpgDistance(0);
            // 行動終了する
            actionArray[1].onAllActionsEnd();
            this.srpgAfterAction();
        }
    };

    // 戦闘開始時に向きを修正する
    Scene_Map.prototype.preBattleSetDirection = function() {
        if ($gameTemp.activeEvent() === $gameTemp.targetEvent()) return;  // 自分自身の時は向きを修正しない
        var differenceX = $gameTemp.activeEvent().posX() - $gameTemp.targetEvent().posX();
        var differenceY = $gameTemp.activeEvent().posY() - $gameTemp.targetEvent().posY();
        if ($gameMap.isLoopHorizontal() === true) {
            var event1X = $gameTemp.activeEvent().posX() > $gameTemp.targetEvent().posX() ? $gameTemp.activeEvent().posX() - $gameMap.width() : $gameTemp.activeEvent().posX() + $gameMap.width();
            var disX = event1X - $gameTemp.targetEvent().posX();
            differenceX = Math.abs(differenceX) < Math.abs(disX) ? differenceX : disX;
        }
        if ($gameMap.isLoopVertical() === true) {
            var event1Y = $gameTemp.activeEvent().posY() > $gameTemp.targetEvent().posY() ? $gameTemp.activeEvent().posY() - $gameMap.height() : $gameTemp.activeEvent().posY() + $gameMap.height();
            var disY = event1Y - $gameTemp.targetEvent().posY();
            differenceY = Math.abs(differenceY) < Math.abs(disY) ? differenceY : disY;
        }
        if (Math.abs(differenceX) > Math.abs(differenceY)) {
            if (differenceX > 0) {
                $gameTemp.activeEvent().setDirection(4);
                if (_srpgDamageDirectionChange === 'true') $gameTemp.targetEvent().setDirection(6);
            } else {
                $gameTemp.activeEvent().setDirection(6);
                if (_srpgDamageDirectionChange === 'true') $gameTemp.targetEvent().setDirection(4);
            }
        } else {
            if (differenceY >= 0) {
                $gameTemp.activeEvent().setDirection(8);
                if (_srpgDamageDirectionChange === 'true') $gameTemp.targetEvent().setDirection(2);
            } else {
                $gameTemp.activeEvent().setDirection(2);
                if (_srpgDamageDirectionChange === 'true') $gameTemp.targetEvent().setDirection(8);
            }
        }
    };

    // SRPG戦闘中は戦闘開始エフェクトを高速化する
    var _SRPG_SceneMap_startEncounterEffect = Scene_Map.prototype.startEncounterEffect;
    Scene_Map.prototype.startEncounterEffect = function() {
        if ($gameSystem.isSRPGMode() === true && _srpgBattleQuickLaunch === 'true') {
            this._encounterEffectDuration = this.encounterEffectSpeed();
        } else {
            _SRPG_SceneMap_startEncounterEffect.call(this);
        }
    };

    // SRPG戦闘中は戦闘開始エフェクトを高速化する
    var _SRPG_SceneMap_updateEncounterEffect = Scene_Map.prototype.updateEncounterEffect;
    Scene_Map.prototype.updateEncounterEffect = function() {
        if ($gameSystem.isSRPGMode() === true && $gameSwitches.value(2) === true) {
            if (this._encounterEffectDuration > 0) {
                this._encounterEffectDuration--;
                this.snapForBattleBackground();
                BattleManager.playBattleBgm();
            }
        } else if ($gameSystem.isSRPGMode() === true && _srpgBattleQuickLaunch === 'true') {
            if (this._encounterEffectDuration > 0) {
                this._encounterEffectDuration--;
                var speed = this.encounterEffectSpeed();
                var n = speed - this._encounterEffectDuration;
                if (n === Math.floor(speed)) {
                    BattleManager.playBattleBgm();
                    this.startFadeOut(this.fadeSpeed() / 2);
                }
            }
        } else {
            _SRPG_SceneMap_updateEncounterEffect.call(this);
        }
    };

    // SRPG戦闘中は戦闘開始エフェクトを高速化する
    var _SRPG_SceneMap_encounterEffectSpeed = Scene_Map.prototype.encounterEffectSpeed;
    Scene_Map.prototype.encounterEffectSpeed = function() {
        if ($gameSystem.isSRPGMode() === true && _srpgBattleQuickLaunch === 'true') {
            return 10;
        } else {
            return _SRPG_SceneMap_encounterEffectSpeed.call(this);
        }
    };

//====================================================================
// ●Scene_Menu
//====================================================================
    // 勝敗条件ウィンドウの作成
    var _SRPG_SceneMenu_create = Scene_Menu.prototype.create;
    Scene_Menu.prototype.create = function() {
        _SRPG_SceneMenu_create.call(this);
        this.createWinLoseWindow();
    };

    Scene_Menu.prototype.createWinLoseWindow = function() {
        const rect = this.srpgWinLoseWindowRect();
        this._winLoseConditionWindow = new Window_WinLoseCondition(rect);
        this.addWindow(this._winLoseConditionWindow);
    };

    // 勝敗ウィンドウのrectを設定する
    Scene_Menu.prototype.srpgWinLoseWindowRect = function() {
        const array = $gameSystem.srpgWinLoseCondition();
        const ww = Graphics.boxWidth;
        const wh = this.calcWindowHeight(array.length + 3, false);
        const wx = 0;
        const wy = Graphics.boxHeight / 2 - wh / 2;
        return new Rectangle(wx, wy, ww, wh);
    };

    // メニュー画面のコマンドウィンドウの作成
    var _SRPG_SceneMenu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _SRPG_SceneMenu_createCommandWindow.call(this);
        if ($gameSystem.isSRPGMode() === true) {
            this._commandWindow.setHandler('turnEnd',this.commandTurnEnd.bind(this));
            this._commandWindow.setHandler('autoBattle',this.commandAutoBattle.bind(this));
            this._commandWindow.setHandler('winLoseCondition',this.commandWinLoseCondition.bind(this));
        }
    };

    // 更新
    Scene_Menu.prototype.update = function() {
        Scene_Base.prototype.update.call(this);
        if (this._winLoseConditionWindow.isOpen()) this.updateWinLoseCondition();
    };

    // 勝敗条件ウィンドウの更新
    Scene_Menu.prototype.updateWinLoseCondition = function() {
        if (Input.isTriggered('ok') || TouchInput.isTriggered() ||
            Input.isTriggered('cancel') || TouchInput.isCancelled()) {
            this._winLoseConditionWindow.close();
            this._commandWindow.activate();
        }
    };

    // ターン終了コマンドの処理
    Scene_Menu.prototype.commandTurnEnd = function() {
        $gameTemp.setTurnEndFlag(true);
        $gameTemp.setAutoBattleFlag(false);
        SceneManager.pop();
    };

    // オート戦闘コマンドの処理    
    Scene_Menu.prototype.commandAutoBattle = function() {
        $gameTemp.setTurnEndFlag(true);
        $gameTemp.setAutoBattleFlag(true);
        SceneManager.pop();
    };

    // 勝敗条件コマンドの処理
    Scene_Menu.prototype.commandWinLoseCondition = function() {
        this._commandWindow.deactivate();
        this._winLoseConditionWindow.open();
    };

//====================================================================
// ●Scene_Equip
//====================================================================
    // アクターコマンドからの装備画面の呼び出しに対応
    Scene_Equip.prototype.popScene = function() {
        if ($gameSystem.isSRPGMode() === true && $gameTemp.activeEvent()) {
            $gameTemp.setSrpgActorEquipFlag(true);
        }
        SceneManager.pop();
    };

//====================================================================
// ●Scene_Load
//====================================================================
    // 戦闘中のセーブデータからロードされた場合、フラグを立てておく
    var _SRPG_Scene_Load_onLoadSuccess = Scene_Load.prototype.onLoadSuccess;
    Scene_Load.prototype.onLoadSuccess = function() {
        _SRPG_Scene_Load_onLoadSuccess.call(this);
        if ($gameSystem.isSRPGMode() === true) {
            $gameTemp.setSrpgLoadFlag(true);
        }
    };

    // マップがツクールで編集されるなどしていた場合、通常はマップをリロードするが、
    // SRPG戦闘中はその機能を無効化しておく（ユニットの位置がリセットされてしまうため）
    var _SRPG_Scene_Load_reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
    Scene_Load.prototype.reloadMapIfUpdated = function() {
        if (!$gameSystem.isSRPGMode()) {
            _SRPG_Scene_Load_reloadMapIfUpdated.call(this);
        }
    };

//====================================================================
// ●Scene_Battle
//====================================================================
    // フェード速度を返す
    Scene_Battle.prototype.fadeSpeed = function() {
        if ($gameSystem.isSRPGMode() === true && _srpgBattleQuickLaunch === 'true') {
           return 12;
        } else {
           return Scene_Base.prototype.fadeSpeed.call(this);
        }
    };

    // すべてのウィンドウの作成
    const _SRPG_Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _SRPG_Scene_Battle_createAllWindows.call(this);
        if ($gameSystem.isSRPGMode() === true) {
            this.createSrpgBattleStatusWindow();
            if ($gameParty.battleMembers()[0] && $gameParty.battleMembers()[0].isAlive()) {
                this.createSrpgBattleResultWindow();
            }
        }
    };

    // ステータスウィンドウの開閉
    const _SRPG_Scene_Battle_updateStatusWindowVisibility = Scene_Battle.prototype.updateStatusWindowVisibility;
    Scene_Battle.prototype.updateStatusWindowVisibility = function() {
        if ($gameSystem.isSRPGMode() === true) {
            if ($gameMessage.isBusy()) {
                this._srpgBattleStatusWindowLeft.close();
                this._srpgBattleStatusWindowRight.close();
            } else if (this.shouldOpenStatusWindow()) {
                this._srpgBattleStatusWindowLeft.open();
                this._srpgBattleStatusWindowRight.open();
            }
        } else {
            _SRPG_Scene_Battle_updateStatusWindowVisibility.call(this);
        }
    };

    // SRPG戦闘用のステータスウィンドウを作る
    Scene_Battle.prototype.createSrpgBattleStatusWindow = function() {
        const rectLeft = this.srpgBattleStatusWindowRect(0);
        const rectRight = this.srpgBattleStatusWindowRect(1);
        this._srpgBattleStatusWindowLeft = new Window_SrpgBattleStatus(rectLeft, 0);
        this._srpgBattleStatusWindowRight = new Window_SrpgBattleStatus(rectRight, 1);
        if ($gameParty.battleMembers()[0]) {
            this._srpgBattleStatusWindowRight.setBattler($gameParty.battleMembers()[0]);
            $gameSystem.preloadFaceGraphic(['actor', $gameParty.battleMembers()[0]]); //顔グラフィックをプリロードする
            if ($gameParty.battleMembers()[1]) {
                this._srpgBattleStatusWindowLeft.setBattler($gameParty.battleMembers()[1]);
                $gameSystem.preloadFaceGraphic(['actor', $gameParty.battleMembers()[1]]); //顔グラフィックをプリロードする
            }
        }
        if ($gameTroop.members()[0]) {
            this._srpgBattleStatusWindowLeft.setBattler($gameTroop.members()[0]);
            $gameSystem.preloadFaceGraphic(['enemy', $gameTroop.members()[0]]); //顔グラフィックをプリロードする
            if ($gameTroop.members()[1]) {
                this._srpgBattleStatusWindowRight.setBattler($gameTroop.members()[1]);
                $gameSystem.preloadFaceGraphic(['enemy', $gameTroop.members()[1]]); //顔グラフィックをプリロードする
            }
        }
        this.addWindow(this._srpgBattleStatusWindowLeft);
        this.addWindow(this._srpgBattleStatusWindowRight);
        //BattleManager.setSrpgBattleStatusWindow(this._srpgBattleStatusWindowLeft, this._srpgBattleStatusWindowRight);
    };

    // SRPG戦闘用のステータスウィンドウのrectを設定する
    Scene_Battle.prototype.srpgBattleStatusWindowRect = function(pos) {
        const ww = Graphics.boxWidth / 2 - 6;
        const wh = Window_Base.prototype.fittingHeight(4);
        const wx = pos === 0 ? 0 : Graphics.boxWidth - ww;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    // SRPG戦闘用のリザルトウィンドウを作る
    Scene_Battle.prototype.createSrpgBattleResultWindow = function() {
        const rect = this.srpgBattleResultWindowRect();
        this._srpgBattleResultWindow = new Window_SrpgBattleResult(rect, $gameParty.battleMembers()[0]);
        this._srpgBattleResultWindow.openness = 0;
        this.addWindow(this._srpgBattleResultWindow);
        BattleManager.setSrpgBattleResultWindow(this._srpgBattleResultWindow);
    };

    // SRPG戦闘用のリザルトウィンドウのrectを設定する
    Scene_Battle.prototype.srpgBattleResultWindowRect = function() {
        const ww = Graphics.boxWidth - 300;
        const wh = Window_Base.prototype.fittingHeight(4);
        const wx = (Graphics.boxWidth - ww) / 2;
        const wy = Graphics.boxHeight / 2 - wh;
        return new Rectangle(wx, wy, ww, wh);
    };
/*
    // ステータスウィンドウのリフレッシュ
    var _SRPG_Scene_Battle_refreshStatus = Scene_Battle.prototype.refreshStatus;
    Scene_Battle.prototype.refreshStatus = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this._srpgBattleStatusWindowLeft.refresh();
            this._srpgBattleStatusWindowRight.refresh();
        } else {
            _SRPG_Scene_Battle_refreshStatus.call(this);
        }
    };

    // ステータスウィンドウの更新
    var _SRPG_Scene_Battle_updateStatusWindow = Scene_Battle.prototype.updateStatusWindow;
    Scene_Battle.prototype.updateStatusWindow = function() {
        if ($gameSystem.isSRPGMode() === true) {
            this._statusWindow.close();
            if ($gameMessage.isBusy()) {
                this._srpgBattleStatusWindowLeft.close();
                this._srpgBattleStatusWindowRight.close();
                this._partyCommandWindow.close();
                this._actorCommandWindow.close();
            } else if (this.isActive() && !this._messageWindow.isClosing()) {
                this._srpgBattleStatusWindowLeft.open();
                this._srpgBattleStatusWindowRight.open();
            }
        } else {
            _SRPG_Scene_Battle_updateStatusWindow.call(this);
        }
    };
*/
    // SRPG戦闘中は戦闘終了時のオートセーブを止める
    Scene_Battle.prototype.terminate = function() {
        Scene_Message.prototype.terminate.call(this);
        $gameParty.onBattleEnd();
        $gameTroop.onBattleEnd();
        AudioManager.stopMe();
        if (this.shouldAutosave() && $gameSystem.isSRPGMode() != true) {
            this.requestAutosave();
        }
    };

//====================================================================
// Map Battle System by Dr.Q
//====================================================================

//====================================================================
// utility functions for finding unit events
//====================================================================

	// get the event for a general battler
	Game_BattlerBase.prototype.event = function() {
		var currentBattler = this;
		var eventId = 0;
		$gameSystem._EventToUnit.forEach(function (battleArray, index) {
			if (battleArray && battleArray[1] === currentBattler) eventId = index;
		});
		return $gameMap.event(eventId);
	};

	// get the event for an actor specifically
	Game_Actor.prototype.event = function() {
		var currentActor = this.actorId();
		var eventId = 0;
		$gameSystem._EventToUnit.forEach(function (battleArray, index) {
			if (battleArray && battleArray[1] === currentActor) eventId = index;
		});
		return $gameMap.event(eventId);
	};

//====================================================================
// process attacks directly on the map scene
//====================================================================

	// force a specific style of battle for one exchange
	Game_System.prototype.forceSRPGBattleMode = function(type) {
		this._battleMode = type;
	};
	Game_System.prototype.clearSRPGBattleMode = function() {
		this._battleMode = null;
	};

	// control whether to use map battle or not
	Game_System.prototype.useMapBattle = function() {
		// forced mode
		if (this._battleMode === 'map') return true;
		else if (this._battleMode === 'normal') return false;
		// system defaults
		else if (_useMapBattle == 3) return true;
		else if (_useMapBattle == 2 && ConfigManager['mapBattle'] == true) return true;
		else if (_useMapBattle == 0) return false;
		else return (_mapBattleSwitch > 0 && $gameSwitches.value(_mapBattleSwitch));
	};

	// set up the map attacks
	var _srpgBattleStart_MB = Scene_Map.prototype.srpgBattleStart;
	Scene_Map.prototype.srpgBattleStart = function(userArray, targetArray) {
		// get the data
		var user = userArray[1];
		var target = targetArray[1];
		var action = user.action(0);
		var reaction = null;

		// check if we're using map battle on this skill
		if (action && action.item()) {
			var mapBattleTag = action.item().meta.mapBattle;
			if (mapBattleTag == 'true') $gameSystem.forceSRPGBattleMode('map');
			else if (mapBattleTag == 'false') $gameSystem.forceSRPGBattleMode('normal');
		}
		if (!$gameSystem.useMapBattle()) {
			_srpgBattleStart_MB.call(this, userArray, targetArray);
			return;
		}

        // battler battle start
        user.onBattleStart();
        target.onBattleStart();

		// prepare action timing
		user.setActionTiming(0);
		if (user != target) target.setActionTiming(1);

		// pre-skill setup
		$gameSystem.clearSrpgStatusWindowNeedRefresh();
		$gameSystem.clearSrpgBattleWindowNeedRefresh();
		this._srpgBattleResultWindowCount = 0;

		// make free actions work
		var addActionTimes = Number(action.item().meta.addActionTimes || 0);
		if (addActionTimes > 0) {
			user.SRPGActionTimesAdd(addActionTimes);
		}

		this.preBattleSetDirection();
		this.eventBeforeBattle();

		// set up the troop and the battle party
        $gameSystem.setupSrpgBattleScene(userArray, targetArray);
		/*
        $gameTroop.clearSrpgBattleEnemys();
		$gameTroop.clear();
		$gameParty.clearSrpgBattleActors();
		if (userArray[0] === 'enemy') $gameTroop.pushSrpgBattleEnemys(user);
		else $gameParty.pushSrpgBattleActors(user);
		if (targetArray[0] === 'enemy') $gameTroop.pushSrpgBattleEnemys(target);
		else $gameParty.pushSrpgBattleActors(target);
		BattleManager.setup(_srpgTroopID, false, true);
		action.setSubject(user);
        */

		// queue the action
		this.srpgAddMapSkill(action, user, target);
        // 使用したスキルのリストに加える
        user.setUsedSkill(action.item().id);

		// queue up counterattack, agi attack plus
        if (user !== target) {
            // 応戦が反撃率に応じる場合、応戦できるか確率判定する
            if (_srpgBattleReaction === 2 && target.cnt > 0) {
                if (Math.random() >= target.cnt) target.clearActions();
            }
		    if (target.currentAction() && target.currentAction().item()) {
                reaction = target.currentAction();
		    	var actFirst = (reaction.speed() > action.speed());
                if (reaction.isForUser() ||
                    reaction.isForFriend() && userArray[0] !== targetArray[0]) {
                    this.srpgAddMapSkill(reaction, target, target, actFirst);
                } else {
                    this.srpgAddMapSkill(reaction, target, user, actFirst);
                }
		    }

                // agi attack plus
                if (_srpgUseAgiAttackPlus === 'true') {
                    if (user.agi >= target.agi) {
                        var firstBattler = user;
                        var secondBattler = target;
                    } else {
                        var firstBattler = target;
                        var secondBattler = user;
                    }
                    if (!firstBattler.currentAction() || !firstBattler.currentAction().item()) {
                        return;
                    }
                    if (firstBattler.currentAction().isForOpponent() &&
                        firstBattler.currentAction().item().meta.doubleAction !== 'false') {
                        var dif = firstBattler.agi - secondBattler.agi;
                        var difMax = secondBattler.agi * _srpgAgilityAffectsRatio - secondBattler.agi;
                        if (difMax === 0) {
                            agilityRate = 100;
                        } else {
                            agilityRate = dif / difMax * 100;
                        }
                        if (agilityRate > Math.randomInt(100)) {
                            var agiAction = firstBattler.action(0);
                            agiAction.setSubject(firstBattler);
                            this.srpgAddMapSkill(agiAction, firstBattler, secondBattler)
                        }
                    }
                }
        }
	};

	// work through the queue of attacks
	var _SRPG_MB_SceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
		_SRPG_MB_SceneMap_update.call(this);

		// there are definitely no map skills in play
		if (!$gameSystem.isSRPGMode() || $gameSystem.isSubBattlePhase() !== 'invoke_action' ||
		!$gameSystem.useMapBattle()) {
			return;
		}
		
        // return when event running
        if ($gameMap.isEventRunning() == true) {
            this._logWindow.hide();
            return;
        }

		// update map skills
		if (!this.waitingForSkill() && !this._srpgBattleResultWindow.isChangeExp()) {
			// process skills
			while (this.srpgHasMapSkills() && !this.waitingForSkill()) {
				this.srpgUpdateMapSkill();
			}

			// process the battle results window
			if (!this.srpgHasMapSkills() && !this._srpgBattleResultWindow.isOpen() &&
			!this._srpgBattleResultWindow.isOpening() && !this.isBusy()) {
				if ($gameParty.battleMembers()[0] && $gameParty.battleMembers()[0].isAlive()) $gameParty.battleMembers()[0].onAllActionsEnd();
				if ($gameParty.battleMembers()[1] && $gameParty.battleMembers()[1].isAlive()) $gameParty.battleMembers()[1].onAllActionsEnd();
				if ($gameTroop.members()[0] && $gameTroop.members()[0].isAlive()) $gameTroop.members()[0].onAllActionsEnd();
				if ($gameTroop.members()[1] && $gameTroop.members()[1].isAlive()) $gameTroop.members()[1].onAllActionsEnd();
				var showResults = this.processSrpgVictory();
				if (!showResults) $gameSystem.setSubBattlePhase('after_battle');
			} else if (this._srpgBattleResultWindow.isOpen()) {
				if (Input.isPressed('ok') || Input.isPressed('cancel') ||
				TouchInput.isPressed() || TouchInput.isCancelled() ||
				this._srpgBattleResultWindowCount <= 0) {
					this._srpgBattleResultWindow.close();
					$gameSystem.setSubBattlePhase('after_battle');
				}
				this._srpgBattleResultWindowCount -= 1;
			}
		} else {
			// time-based waiting
			this.updateSkillWait();
		}
	};

	// reset battle mode between skills
	var _srpgAfterAction = Scene_Map.prototype.srpgAfterAction;
	Scene_Map.prototype.srpgAfterAction = function() {
		$gameSystem.clearSRPGBattleMode();
        this._logWindow.clear();
        this._logWindow.hide();
		_srpgAfterAction.call(this);
	};

	// time-based skill wait!
	Scene_Map.prototype.setSkillWait = function(time) {
		this._skillWait = time;
	};
	Scene_Map.prototype.updateSkillWait = function() {
		if (this._skillWait > 0) this._skillWait--;
	};
	Scene_Map.prototype.resetSkillWait = function() {
		this._skillWait = undefined;
	};
	Scene_Map.prototype.skillWait = function() {
		return this._skillWait || 0;
	};
	Scene_Map.prototype.skillAnimWait = function() {
		return (this._skillWait == undefined);
	};

	// check if we're still waiting for a skill to finish
	Scene_Map.prototype.waitingForSkill = function() {
		if ($gameTemp.isCommonEventReserved()) return true;

		if ($gamePlayer.isAnimationPlaying() || !$gamePlayer.isStopping() ||
		$gameTemp.isAutoMoveDestinationValid()) return true;

		if (this.skillAnimWait()) {
			var active = $gameTemp.activeEvent();
			if (active.isAnimationPlaying() || !active.isStopping()) return true;

			var target = $gameTemp.targetEvent();
			if (!target) return false;
			if (target.isAnimationPlaying() || !target.isStopping()) return true;
		} else if (this.skillWait() > 0) return true;

		if (this._waitCount > 0) return true;

		return false;
	};

	// no moving during a skill!
	var _Game_Player_MB_canMove = Game_Player.prototype.canMove;
	Game_Player.prototype.canMove = function() {
		if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'invoke_action') {
			return false;
		}
		return _Game_Player_MB_canMove.call(this);
	};

	// no pausing, either!
	var _updateCallMenu_MB = Scene_Map.prototype.updateCallMenu;
	Scene_Map.prototype.updateCallMenu = function() {
		if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'invoke_action') {
			this.menuCalling = false;
			return;
		}
		_updateCallMenu_MB.call(this);
	};

//====================================================================
// queue of skills being executed on the map
//====================================================================

	// queue up a skill for the on-map battle
	Scene_Map.prototype.srpgAddMapSkill = function(action, user, target, addToFront) {
		this._srpgSkillList = this._srpgSkillList || [];
        if (_AAPwithYEP_BattleEngineCore === 'false') {
			var data = {
				action: action,
				user: user,
				target: target,
				phase: 'start',
				count: action.numRepeats(),
			};
        } else {
			var data = {
				action: action,
				user: user,
				target: target,
				phase: 'start',
				count: action.numRepeats() + action.item()._srpgRepeats,
			};
        }
		if (addToFront) this._srpgSkillList.unshift(data);
		else this._srpgSkillList.push(data);
	};

	// build the physical counter attack
	Scene_Map.prototype.srpgAddCounterAttack = function(user, target) {
		target.srpgMakeNewActions();
		target.action(0).setSubject(target);
		target.action(0).setAttack();
		this.srpgAddMapSkill(target.action(0), target, user, true);
		this._srpgSkillList[0].counter = true;
	};

	// check how many skills are left on the queue
	Scene_Map.prototype.srpgHasMapSkills = function() {
		this._srpgSkillList = this._srpgSkillList || [];
		return this._srpgSkillList.length;
	};

	// clear all enqueued skills
	Scene_Map.prototype.srpgClearMapSkills = function() {
		this._srpgSkillList = this._srpgSkillList || [];
		this._srpgSkillList.clear();
	};

	// get the next skill off the queue and invoke it
	Scene_Map.prototype.srpgUpdateMapSkill = function() {
		this._srpgSkillList = this._srpgSkillList || [];
		var data = this._srpgSkillList.shift();
		if (!data) return false;
		return this.srpgInvokeMapSkill(data);
	};

	// invoke skill effects
	Scene_Map.prototype.srpgInvokeMapSkill = function(data) {
		var action = data.action;
		var user = data.user;
		var target = data.target;

		switch (data.phase) {
			// skill cost and casting animations
			case 'start':
				if (!user.canMove() || !user.canUse(action.item()) || (!action.isForDeadFriend() && !target.isAlive())) {
					data.phase = 'cancel';
					this._srpgSkillList.unshift(data);
					break;
				}
				user.useItem(action.item());
                // set skill name window
                // this check is just for my AoE animation plugin, AoE and Agi attack message won't show up repeatedly
				if (!$gameTemp.isFirstAction || $gameTemp.isFirstAction(user)) {
                    this._logWindow.show();
                    this._logWindow.displayAction(user, action.item());

					var castAnim = false;
					// cast animation, is a skill, isn't an attack or guard
					if (action.item().castAnimation && action.isSkill() && !action.isAttack() && !action.isGuard()) {
                        $gameTemp.requestAnimation([user.event()], action.item().castAnimation);
						castAnim = true;
					}
					// target animation
					if (action.item().meta.targetAnimation) {
                        $gameTemp.requestAnimation([$gamePlayer], Number(action.item().meta.targetAnimation));
						castAnim = true;
					}
					// directional target animation
					if (action.item().meta.directionalAnimation) {
						var dir = user.event().direction()/2 - 1;
                        $gameTemp.requestAnimation([$gamePlayer], dir + Number(action.item().meta.directionalAnimation));
						castAnim = true;
					}
				}
				// check for reflection
				if (user != target && Math.random() < action.itemMrf(target)) {
					data.phase = 'reflect';
				} else {
					data.phase = 'animation';
				}
				this._srpgSkillList.unshift(data);
				break;

			// reflected magic
			case 'reflect':
				target.performReflection();
				if (target.reflectAnimationId) {
                    $gameTemp.requestAnimation([target.event()], target.reflectAnimationId());
				}
				data.target = user;
				data.phase = 'animation';
				this._srpgSkillList.unshift(data);
				break;

			// show skill animation
			case 'animation':
				var animation = action.item().animationId;
				if (animation < 0) animation = (user.isActor() ? user.attackAnimationId1() : user.attackAnimationId());
				var animationData = $dataAnimations[animation];
                if (animationData) {
                    // MZ animation
                    if (animationData.displayType) {
                        if (animationData.displayType === 0 || $gameMap.mapBattleAnimationFlagPos3() !== true) {
                            if (animationData.displayType !== 1) {
                                $gameTemp.requestAnimation([target.event()], animation);
                            } else {
                                $gameTemp.requestAnimation([$gamePlayer], animation);
                            }
                            $gameMap.setMapBattleAnimationFlagPos3(true);
                        }
                    // MV animation
                    } else {
                        if (animationData.position !== 3 || $gameMap.mapBattleAnimationFlagPos3() !== true) {
                            $gameTemp.requestAnimation([target.event()], animation);
                            $gameMap.setMapBattleAnimationFlagPos3(true);
                        }
                    }
                }
				data.phase = 'effect';
				this._srpgSkillList.unshift(data);
				// time-based delay
				var delay = _animDelay;
				if (action.item().meta.animationDelay) delay = Number(action.item().meta.animationDelay);
				if (delay >= 0) this.setSkillWait(delay);
				break;

			// apply skill effects
			case 'effect':
				// skill effect repeats
				data.count--;
				if (data.count > 0) {
					data.phase = 'animation';
				} else {
					data.phase = 'global';
				}
				this._srpgSkillList.unshift(data);
				this.resetSkillWait();

				// apply effects or trigger a counter
                /* Cnt(反撃率)による反撃は無効化する（応戦と機能が重複し、かつ混乱を招くため）
				if (!data.counter && user != target && Math.random() < action.itemCnt(target)) {
					var attackSkill = $dataSkills[target.attackSkillId()];
					if (target.canUse(attackSkill) === true) {
						target.performCounter();
						this.srpgAddCounterAttack(user, target);
					} else {
						action.apply(target);
					}
				} else {
					action.apply(target);
				}
                */
                action.apply(target);
				break;

			// run the common events and such
			case 'global':
				action.applyGlobal();
				data.phase = 'end';
				this._srpgSkillList.unshift(data);
				break;

			// clean up at the end
			case 'cancel':
			case 'end':
				user.setLastTarget(target);
				user.removeCurrentAction();
				this._waitCount = 20;
				break;
		}

		// Show the results
		user.srpgShowResults();
		target.srpgShowResults();
		return true;
	};

	// show the results of the action
	Game_BattlerBase.prototype.srpgShowResults = function() {
		var result = this.result();
		// ways to hit
		if (result.isHit()) {
			if (result.hpDamage > 0 && !result.drain) this.performDamage();
			if (result.hpDamage < 0 || result.mpDamage < 0 || result.tpDamage < 0) this.performRecovery();
			var target = this;
			result.addedStateObjects().forEach(function(state) {
				if (state.id === target.deathStateId()) target.performCollapse();
			});
		}
		// ways to miss
		else {
			if (result.missed) this.performMiss();
			if (result.evaded && result.physical) this.performEvasion();
			if (result.evaded && !result.physical) this.performMagicEvasion();
		}
		// show pop-ups
		this.startDamagePopup();
	};

//====================================================================
// Handle battle rewards
//====================================================================

	// add "rewards" object to the map scene
	var _scene_map_initialize_MB = Scene_Map.prototype.initialize;
	Scene_Map.prototype.initialize = function() {
		_scene_map_initialize_MB.call(this);
		this._rewards = {};
	};

	// put a results window in the scene
	var _scene_map_createAllWindows_MB = Scene_Map.prototype.createAllWindows;
	Scene_Map.prototype.createAllWindows = function() {
		_scene_map_createAllWindows_MB.call(this);
		this.createSrpgBattleResultWindow();
	};
	Scene_Map.prototype.createSrpgBattleResultWindow = function() {
        const rect = Scene_Battle.prototype.srpgBattleResultWindowRect();
		this._srpgBattleResultWindow = new Window_SrpgBattleResult(rect, $gameParty.battleMembers()[0]);
		this._srpgBattleResultWindow.openness = 0;
		this.addWindow(this._srpgBattleResultWindow);
	};

	// use all the existing code for rewards, so it can inherit plugin modifications
	Scene_Map.prototype.makeRewards = BattleManager.makeRewards;
	Scene_Map.prototype.gainRewards = BattleManager.gainRewards;
	Scene_Map.prototype.gainExp = BattleManager.gainExp;
	Scene_Map.prototype.gainGold = BattleManager.gainGold;
	Scene_Map.prototype.gainDropItems = BattleManager.gainDropItems;

	// process victory
	Scene_Map.prototype.processSrpgVictory = function() {
		if ($gameParty.battleMembers()[0] && $gameParty.battleMembers()[0].isAlive()) {
			this.makeRewards();
			if (this._rewards.exp > 0 || this._rewards.gold > 0 || this._rewards.items.length > 0) {
				this._srpgBattleResultWindow.setBattler($gameParty.battleMembers()[0]);
				this._srpgBattleResultWindow.setRewards(this._rewards);
				var se = {};
				se.name = _rewardSe;
				se.pan = 0;
				se.pitch = 100;
				se.volume = 90;
				AudioManager.playSe(se);
				this._srpgBattleResultWindow.open();
				this._srpgBattleResultWindowCount = 90;
				this.gainRewards();
				return true;
			}
			return false;
		}
	};

//====================================================================
// show popups for tile and status damage
//====================================================================

	// show pop-up for regeneration
	var _battler_regenerateAll_MB = Game_Battler.prototype.regenerateAll;
	Game_Battler.prototype.regenerateAll = function() {
		_battler_regenerateAll_MB.call(this);
		if ($gameSystem.isSRPGMode()) {
			this._result.used = true;
			this.srpgShowResults();
            this.slipFloorAddDeath();// 戦闘不能の処理
		}
	};

	// show pop-up for floor damage
	var _srpgExecuteFloorDamage_MB = Game_Battler.prototype.srpgExecuteFloorDamage;
	Game_Battler.prototype.srpgExecuteFloorDamage = function() {
		_srpgExecuteFloorDamage_MB.call(this);
		if (this._result.hpDamage != 0) {
			this._result.used = true;
			this.srpgShowResults();
            this.slipFloorAddDeath();// 戦闘不能の処理
		}
	};

	// suppress the screen flash from damage in SRPG mode
	var _startFlashForDamage_MB = Game_Screen.prototype.startFlashForDamage;
	Game_Screen.prototype.startFlashForDamage = function() {
		if (!$gameSystem.isSRPGMode()) _startFlashForDamage_MB.call(this);
	};

    // スリップ・床ダメージでの戦闘不能処理
    Game_Battler.prototype.slipFloorAddDeath = function() {
        var event = $gameMap.event(this.srpgEventId());
        if (this.isDead() && !event.isErased()) {
            event.erase();
            if (this.isActor()) {
            var oldValue = $gameVariables.value(_existActorVarID);
                $gameVariables.setValue(_existActorVarID, oldValue - 1);
            } else {
                var oldValue = $gameVariables.value(_existEnemyVarID);
                $gameVariables.setValue(_existEnemyVarID, oldValue - 1);
            }
        }
    };

//====================================================================
// on-map damage pop-ups
//====================================================================

	// initialize the damage popups
	var _sprite_character_initMembers_MB = Sprite_Character.prototype.initMembers;
	Sprite_Character.prototype.initMembers = function() {
		_sprite_character_initMembers_MB.call(this);
		this._damages = [];
	};

	// update the damage popups
	var _sprite_character_update_MB = Sprite_Character.prototype.update;
	Sprite_Character.prototype.update = function (){
		_sprite_character_update_MB.call(this);
		if (this._character.isEvent()) {
			this.updateDamagePopup_MB();
		}
	};

	// update the damage pop-ups each frame
	Sprite_Character.prototype.updateDamagePopup_MB = function() {
		this.setupDamagePopup_MB();
		if (this._damages.length > 0) {
			for (var i = 0; i < this._damages.length; i++) {
				this._damages[i].update();
			}
			if (!this._damages[0].isPlaying()) {
				this.parent.removeChild(this._damages[0]);
				this._damages.shift();
			}
		}
	};

	// create the damage pop-up
	Sprite_Character.prototype.setupDamagePopup_MB = function() {
		var array = $gameSystem.EventToUnit(this._character.eventId());
		if ($gameSystem.isSRPGMode() && array && array[1]) {
			var battler = array[1];
			if (battler.isDamagePopupRequested()) {
				var sprite = new Sprite_Damage();
				sprite.x = this.x;
				sprite.y = this.y;
				sprite.z = 9;
				sprite.setup(battler);
				this._damages.push(sprite);
				this.parent.addChild(sprite);;
			}
			battler.clearDamagePopup();
			battler.clearResult();
		}
	};

//====================================================================
// compatability overrides
//====================================================================

	// track intended repeats from before BattleEngineCore
	if (DataManager.addActionEffects) {
		var _addActionEffects = DataManager.addActionEffects;
		DataManager.addActionEffects = function(obj, array) {
			var initialRepeats = obj.repeats;
			_addActionEffects.call(this, obj, array);
			obj._srpgRepeats = initialRepeats - obj.repeats;
		};
	}

//====================================================================
// Config
//====================================================================
    // オプションからマップバトルの使用/不使用を切り替えられるようにする
    ConfigManager.mapBattle = false;

    var _MB_ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _MB_ConfigManager_makeData.call(this);
        config.mapBattle = this.mapBattle;
        return config;
    };

    var _MB_ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _MB_ConfigManager_applyData.call(this, config);
        this.mapBattle = this.readFlag(config, 'mapBattle');
    };

    var _MB_Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _MB_Window_Options_addGeneralOptions.call(this);
        if (_useMapBattle === 2) this.addCommand(_textSrpgOptMapBattle, 'mapBattle');
    };

})();
