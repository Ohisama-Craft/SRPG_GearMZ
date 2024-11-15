//=============================================================================
//SRPG_Summon_MZ.js
// Copyright (c) 2020 Shoukang. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Allow you to summon/enemy/objects during SRPG battle, edited by OhisamaCraft.
 * @author Shoukang
 * @base SRPG_core_MZ
 * @orderAfter SRPG_core_MZ
 *
 * @param Summon Map Id
 * @desc the map Id for summon events
 * @type number
 * @default 1
 *
 * @param summon appear Animation Id
 * @desc appear animation for wrap skill, input 0 to disable
 * @type animation
 * @default 52
 *
 * @param summon disappear Animation Id
 * @desc disappear animation for wrap skill, input 0 to disable
 * @type animation
 * @default 52
 * 
 * ==== plugin command ==== 
 * 
 * @command SrpgSummon
 * @text Unit Summoning
 * @desc Call and place the specified unit from the summoning map.
 * @arg type
 * @type select
 * @text Unit Type
 * @desc This specifies the type of unit to be summoned.
 * @option actor
 * @value actor
 * @option guest
 * @value guest
 * @option enemy
 * @value enemy
 * @option object
 * @value object
 * @option unitEvent for actor
 * @value unitEventForActor
 * @option unitEvent for enemy
 * @value unitEventForEnemy
 * @option unitEvent for actor and enemy
 * @value unitEventForAll
 * @option playerEvent
 * @value playerEvent
 * @default actor
 * @arg summonId
 * @type number
 * @text Event ID of the summoning source.
 * @desc This is the event ID of the unit to be copied from the summoning map.
 * @min 1
 * @default 1
 * @arg battlerId
 * @type number
 * @text actor/enemy ID
 * @desc This is the ID of the actor or enemy character.
 * @min 1
 * @default 1
 * @arg level
 * @type number
 * @text actor level
 * @desc The level of the summoned actor. 0: The actor's initial level. -1: The same level as the summoner.
 * @min -1
 * @default -1
 * @arg turn
 * @type number
 * @text Expiration period
 * @desc The event will disappear after this number of turns. A value of 0 indicates infinite duration.
 * @min 0
 * @default 0
 * @arg x
 * @type number
 * @text X-coordinate
 * @desc This is the X-coordinate for the summoning destination. A value of -1 indicates the cursor's X-coordinate.
 * @min -1
 * @arg y
 * @type number
 * @text Y-coordinate
 * @desc This is the Y-coordinate for the summoning destination. A value of -1 indicates the cursor's Y-coordinate.
 * @min -1
 * @arg mode
 * @type select
 * @text battle mode
 * @desc This is the battle mode to be set during summoning (please set the battle mode if the target requires it).
 * @option normal
 * @option stand
 * @option regionUp
 * @option regionDown
 * @option absRegionUp
 * @option absRegionDown
 * @option aimingEvent
 * @option aimingActor
 * @default normal
 *
 * @help
 * copyright 2020 Shoukang. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * This plugin allow you to summon events which are copy of events from the summon map (the map with Summon Map Id).
 * You need to place all the type of events you want to summon in the summon map.
 * Summon units on unpassable tiles will be ignored.
 *
 * Although summoning battlers just need an empty event to refer to, this mechanism could be very helpful for summoning
 * objects. You can even use this plugin to summon objects out of an SRPG battle!(summoned events will not be memorized)
 * 
 * You don't need any place holder event to summon. A new event will be created, which have the event id =
 * $gameMap.nextEventId() (this is before the summon, after summon the length will of course increase by 1).
 *
 * By calling a common event in your skill effect, you can summon multiple same actors/enemies/objects, set their level,
 * their life span, etc. Please read the script calls for more information.
 *
 * ===================================================================================================
 * Compatibility:
 * Need Dr.Q's SRPG_PositionEffect plugin to use the <cellTarget> note tag so that you can target an empty cell.
 * Need SRPG_AoE in my bug fix patch if you use AoE summon. It fixed a bug for aoe cellTarget.
 * However the enemy still won't know how to cast skill without a target.
 * ===================================================================================================
 * script calls:
 *
 * this.summon(type, summonId, battlerId, level, turn, x, y, mode);
 *     type: can be 'actor', 'guest', 'enemy', or 'object', or other valid types.
 *     summonId: the id of the event that you are going to copy from the Summon Map.
 *     battlerId: the id of actor/enemy.
 *     level: the level of summoned actor, default is initial level of actor.
 *     turn: the life span of this event. After this number of turns the event will disappear. default is infinite.
 *     x: x position, default is $gamePlayer.posX();
 *     y: y position, default is $gamePlayer.posY();
 *     mode: This is the battle mode for summoned actors or enemies. The default is 'normal'.
 * 
 *     Actors summoned with type: 'actor' will be displayed on the menu screen and counted among the surviving actors.
 *     Actors summoned with type: 'guest' will not be displayed on the menu screen and 
 *     will not be counted among the surviving actors.
 * 
 *     If you want to use the default vaule of a parameter, or a parameter is not needed for your summon and
 *     you are not sure what to put, simply use undefined (do not add '') as a place holder.
 *
 *     For example, this.summon('actor', 1, 2, undefined, undefined, 5, 6); will summon actor 2 at postion (5, 6), 
 *     the event is a copy of event id 1 in the summon map.
 *     You can use var a = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1] to store the active battler as a
 *     variable a. Then you can use a.mat, a.level and other formulars to determine summoned batter level and summon turns.
 *     For example this.summon('actor', 1, 2, a.level, a.mat/10)
 *
 * this.AoESummon(type, summonId, battlerId, level, turn);
 *     Same, use this for an AoE summon skill to summon multiple units.
 *
 * $gameParty.existingMemberNumber();
 *     gives the number of alive party members, which doesn't take summoned actors into consideration.
 *     Can be used to check game end condition.
 * ===================================================================================================
 * v 1.04 Fix a bug for wrong action subject.
 * v 1.03 fix a bug where summoned battlers disappear after save & load.
 * v 1.02 can summon events above or below a battler.(for the use of summon magic circles)!However it's not allowed to summon multiply magic circles on the same tile.
 * v 1.01 add aoe summon, fix bugs, enable more summon event types.
 * v 1.00 First Release
 */

/*:ja
 * @target MZ
 * @plugindesc SRPG戦闘中に敵キャラやオブジェクトを召喚することが可能になります（おひさまクラフトによる改変）。
 * @author Shoukang
 * @base SRPG_core_MZ
 * @orderAfter SRPG_core_MZ
 *
 * @param Summon Map Id
 * @desc 召喚イベント用のマップID
 * @type number
 * @default 1
 *
 * @param summon appear Animation Id
 * @desc 出現時演出用アニメーションID。0にすると表示されません。
 * @type animation
 * @default 52
 *
 * @param summon disappear Animation Id
 * @desc 消去時演出用アニメーションID。0にすると表示されません。
 * @type animation
 * @default 52
 * 
 * ==== plugin command ==== 
 * 
 * @command SrpgSummon
 * @text ユニットの召喚
 * @desc 指定したユニットを召喚用マップから呼び出し、配置します。
 * @arg type
 * @type select
 * @text ユニットの種類
 * @desc 召喚するユニットの種類です。
 * @option アクター
 * @value actor
 * @option ゲストアクター
 * @value guest
 * @option エネミー
 * @value enemy
 * @option オブジェクト
 * @value object
 * @option ユニットイベント（アクター用）
 * @value unitEventForActor
 * @option ユニットイベント（エネミー用）
 * @value unitEventForEnemy
 * @option ユニットイベント（全員用）
 * @value unitEventForAll
 * @option プレイヤーイベント
 * @value playerEvent
 * @default actor
 * @arg summonId
 * @type number
 * @text 召喚元のイベントID
 * @desc 召喚マップからコピーするイベントのIDです。
 * @min 1
 * @default 1
 * @arg battlerId
 * @type number
 * @text アクター/エネミーID
 * @desc アクターあるいは敵キャラのIDです。
 * @min 1
 * @default 1
 * @arg level
 * @type number
 * @text アクターのレベル
 * @desc 召喚されるアクターのレベル。0でそのアクターの初期レベル、-1で召喚者と同じレベル。
 * @min -1
 * @default -1
 * @arg turn
 * @type number
 * @text イベントの有効期限
 * @desc このターン数が経過すると、そのイベントは消滅します。0で無限です。
 * @min 0
 * @default 0
 * @arg x
 * @type number
 * @text X座標
 * @desc 召喚先のX座標です。マップ左上が(0, 0)。-1でカーソルのX座標になります。
 * @min -1
 * @default -1
 * @arg y
 * @type number
 * @text Y座標
 * @desc 召喚先のY座標です。マップ左上が(0, 0)。-1でカーソルのY座標になります。
 * @min -1
 * @default -1
 * @arg mode
 * @type select
 * @text 戦闘モード
 * @desc 召喚時に設定する戦闘モードです（対象が必要なときは戦闘モードの設定をしてください）。
 * @option normal
 * @option stand
 * @option regionUp
 * @option regionDown
 * @option absRegionUp
 * @option absRegionDown
 * @option aimingEvent
 * @option aimingActor
 * @default normal
 *
 * @help
 * copyright 2020 Shoukang. all rights reserved.
 * Released under the MIT license.
 * ============================================================================
 * 本プラグインを使用することで、召喚イベントを作成することが可能になります。
 * 召喚イベントは召喚マップ（Summon Map Idにて指定したマップ）上のイベントのコピーです。
 * 召喚マップ上にすべての種類の召喚対象イベントを配置する必要があります。
 * 通行不可タイル上にある召喚ユニットは無視されます。
 *
 * バトラーの召喚に必要なのは参照する空のイベントだけです。この仕組みはオブジェクトの召喚にも使用できます。
 * SRPG戦闘外で召喚することさえできます！（召喚されたイベントはセーブされません）
 * 
 * 召喚用のイベントをSRPG戦闘用マップに配置する必要はありません。$gameMap.nextEventId()と同じIDを持つ新しいイベントが作成されます。
 * （この値は召喚後は+1されます。）
 *
 * スキルの使用効果としてコモンイベントを呼び出すことで、同一のアクター/敵キャラ/オブジェクトを複数召喚したり、レベルや期限を設定した
 * りすることができます。詳細は「スクリプト呼び出し」をご覧ください。
 *
 * ===================================================================================================
 * 互換性:
 * 空のマスを対象に取れるようにするには、<cellTarget>メモタグを使用するのでDr.Q氏のSRPG_PositionEffectプラグインが必要です。
 * AoEの召喚を使用する場合、SRPG_AoEが必要になります。AoEのcellTargetのバグ修正が含まれています。
 * ただし現在のところ敵は対象なしのスキルの使用を判定しません。
 * ===================================================================================================
 * スクリプト呼び出し:
 *
 * this.summon(type, summonId, battlerId, level, turn, x, y, mode);
 *     type: 「actor」「guest」「enemy」「object」のいずれか、あるいは別の有効なタイプを入力します。
 *     summonId: 召喚マップからコピーするイベントのIDです。
 *     battlerId: アクターあるいは敵キャラのIDです。
 *     level: 召喚されるアクターのレベルです。デフォルトはそのアクターの初期レベルです。
 *     turn: このイベントの有効期限。この数のターン数が経過すると、そのイベントは消滅します。デフォルトは無限です。
 *     x: Ｘ座標。デフォルトは$gamePlayer.posX();（プレイヤーのＸ座標）
 *     y: Y座標。デフォルトは$gamePlayer.posY();（プレイヤーのY座標）
 *     mode: 召喚されるアクターあるいは敵キャラの戦闘モードです。デフォルトは'normal'です。
 *
 *     type:'actor'で召喚したアクターはメニュー画面に表示され、生存しているアクター数に含まれます。
 *     type:'guest'で召喚したアクターはメニュー画面に表示されず、生存しているアクター数にも含まれません。
 * 
 *     パラメータ不要あるいは適切なパラメータ不明など、パラメータのデフォルト値をそのまま使用したい場合、そのパラメータには
 *     「undefined」と入力してください。
 *
 *     例：this.summon('actor', 1, 2, undefined, undefined, 5, 6); ID2のアクターを座標(5, 6)に召喚します。 
 *     イベントは召喚マップ上のID1のイベントのコピーになります。
 *     var a = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1] とすることで、変数aにアクティブなバトラーを
 *     代入することができます。これによって「a.mat」や「a.level」などの式が参照可能になります。
 *     例：this.summon('actor', 1, 2, a.level, a.mat/10)
 *
 * this.AoESummon(type, summonId, battlerId, level, turn);
 *     上記とほぼ同じですが、AoEを使用して複数のユニットを召喚する場合こちらを使用してください。
 *
 * $gameParty.existingMemberNumber();
 *     生存しているパーティメンバーの数を表しますが、召喚されたアクターは数に含まれないことにご注意ください。
 *     ゲーム終了条件の判定に使用できます。
 * ===================================================================================================
 * v 1.04 誤った行動主体の不具合を修正
 * v 1.03 セーブ・ロード後に召喚されたバトラーが消えてしまう不具合を修正
 * v 1.02 バトラーの上または下にイベントを召喚することが可能になりました（召喚魔法円などに使用）。ただし複数の魔法円を同一タイルに召喚することはできません。
 * v 1.01 AoE召喚の追加、不具合修正、より多くのイベント種別に対応。
 * v 1.00 リリース
 */

//====================================================================
// ●Function Declaration
//====================================================================
function Game_SummonEvent() {
    this.initialize(...arguments);
}

Game_SummonEvent.prototype = Object.create(Game_Event.prototype);
Game_SummonEvent.prototype.constructor = Game_SummonEvent;

//====================================================================
// ●Plugin
//====================================================================
(function () {
    //=================================================================================================
    //Plugin Parameters
    //=================================================================================================
    const pluginName = "SRPG_Summon_MZ";

    var parameters = PluginManager.parameters('SRPG_Summon_MZ');
    var _SummonMapId = Number(parameters['Summon Map Id']) || 1;
    var _appearAnimation = Number(parameters['summon appear Animation Id']) || 0;
    var _disappearAnimation = Number(parameters['summon disappear Animation Id']) || 0;

    var coreParameters = PluginManager.parameters('SRPG_core_MZ');
    var _existActorVarID = Number(coreParameters['existActorVarID'] || 1);
    var _existEnemyVarID = Number(coreParameters['existEnemyVarID'] || 2);

    //====================================================================
    // ●Plugin Command
    //====================================================================
    PluginManager.registerCommand(pluginName, "SrpgSummon", function(args) {
        const summoner = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        let level = Number(args.level);
        if (level === 0) level = undefined;
        if (level === -1 && summoner) level = summoner.level;
        let turn = Number(args.turn);
        if (turn === 0) turn = undefined;
        let x = Number(args.x);
        if (x === -1) x = $gamePlayer.posX();
        let y = Number(args.y);
        if (y === -1) y = $gamePlayer.posY();
        this.summon(args.type, Number(args.summonId), Number(args.battlerId), level, turn, x, y, args.mode);
    });


    //$dataSummon is the global variable that stores the summon Map data.
    DataManager.loadSummonData = function(mapId) {
        if (mapId > 0) {
            var filename = 'Map%1.json'.format(mapId.padZero(3));
            //this._mapLoader = ResourceHandler.createLoader('data/' + filename, this.loadDataFile.bind(this, '$dataSummon', filename));
            this.loadDataFile('$dataSummon', filename);
        } else {
            this.makeEmptyMap();
        }
    };


    var _DataManager_onLoad = DataManager.onLoad
    DataManager.onLoad = function(object) {
        _DataManager_onLoad.call(this, object);
        if (object === $dataSummon) {
            this.extractMetadata(object);
            for (var i = 0; i < object.events.length; i++) {
                var data = object.events[i];
                if (data && data.note !== undefined) {
                    this.extractMetadata(data);
                }
            }
        }
    };

    //load the summon data while loading this plugin.
    DataManager.loadSummonData(_SummonMapId);

    Game_Interpreter.prototype.AoESummon = function(type, summonId, battlerId, level, turn){
        var aoe = $gameTemp._activeAoE;
        var rlim = 1 + aoe.size * 2;
        for (var m = 0; m < rlim; ++m) {
            for (var n =0; n < rlim; ++n) {
                var x = $gameMap.roundX($gamePlayer.posX() + m - aoe.size);
                var y = $gameMap.roundY($gamePlayer.posY() + n - aoe.size);
                if ($gameMap.isValid(x, y) && $gameMap.inArea(m-aoe.size, n-aoe.size, aoe.size, aoe.minSize, aoe.shape, aoe.dir)) {
                    this.summon(type, summonId, battlerId, level, turn, x, y);
                }
            }
        }
    }

    // script call
    // modified by OhisamaCraft
    Game_Interpreter.prototype.summon = function(type, summonId, battlerId, level, turn, x, y, mode){
        if (x === undefined || x < 0) x = $gamePlayer.posX();
        if (y === undefined || y < 0) y = $gamePlayer.posY();
        if (!turn) turn = 10000;//Number.POSITIVE_INFINITY;
        if (!mode) mode = 'normal';
        var modifiedXy = this.modifySummonPoint(x, y) // 出現位置の補正
        x = modifiedXy[0]; y = modifiedXy[1];
        if (!$gameMap.canSummon(type, summonId, battlerId,x,y)) return;
        if ($gameTemp.activeEvent() && $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())){
            $gameTemp.activeEvent().turnTowardCharacter($gamePlayer);
            var summoner = $gameSystem.EventToUnit($gameTemp.activeEvent().eventId())[1];
        } else {
            var summoner = null;
        }
        var eventId = $gameMap.nextEventId();
        var summonEvent = new Game_SummonEvent($gameMap.mapId(), eventId, summonId, summoner, turn, x, y);
        $gameMap.addEvent(eventId, summonEvent);
        if (type === 'actor'){
            this.addSummonActor(eventId, battlerId, level, mode);
        } else if (type === 'guest'){
            this.addSummonGuest(eventId, battlerId, level, mode);
        } else if (type === 'enemy'){
            this.addSummonEnemy(eventId, battlerId, mode);
        } else summonEvent.setType(type);

        if (SceneManager._scene instanceof Scene_Map){
            SceneManager._scene._spriteset.addCharacter(summonEvent);
            //SceneManager._scene._spriteset.createCharacters();
        }
        $gameTemp.requestAnimation([summonEvent], _appearAnimation);
    }

    // modify summon XY
    // modified by OhisamaCraft
    Game_Interpreter.prototype.modifySummonPoint = function(x, y) {
        var edges = [];
        edges.push([x, y, 0]);
        modXyBreak: for (var i = 0; i < edges.length; i++) {
            var newX = edges[i][0];
            var newY = edges[i][1];
            var previous = edges[i][2];
            var events = $gameMap.eventsXyNt(newX, newY);
            if (events.length === 0) break;
            for (var num = 0; num < events.length; num++) {
                var event = events[num];
                if (['actor', 'enemy', 'object', 'playerEvent'].indexOf(event.isType()) < 0) break modXyBreak;
            }
            for (var d = 2; d < 10; d += 2) {
                if ($gamePlayer.srpgAppearCanPass(newX, newY, d, 0) && previous !== (10 - d)) {
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

    // modified by OhisamaCraft
    Game_Interpreter.prototype.addSummonActor = function(eventId, actorId, level, mode) {
        var actor_unit = new Game_Actor(actorId);
        var event = $gameMap.event(eventId);
        var mode = mode ? mode : 'normal';
        actor_unit.setSummoner(event.summoner());
        if (level){
            actor_unit.changeLevel(level, false);
            actor_unit.recoverAll();
        }
        actor_unit.initTp(); //TPを初期化
        actor_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
        let bitmap = ImageManager.loadFace(actor_unit.faceName()); //顔グラフィックをプリロードする
        $gameSystem.setEventToUnit(event.eventId(), 'actor', actor_unit);
        event.setType('actor');
        actor_unit.setBattleMode(mode);
        $gameMap.setEventImages();
        $gameSystem.pushSrpgAllActors(event.eventId());//add
        const oldValue = $gameVariables.value(_existActorVarID);
        $gameVariables.setValue(_existActorVarID, oldValue + 1);
        return actor_unit;
    };

    Game_Interpreter.prototype.addSummonGuest = function(eventId, actorId, level, mode) {
        var actor_unit = new Game_Actor(actorId);
        var event = $gameMap.event(eventId);
        var mode = mode ? mode : 'normal';
        actor_unit.setSummoner(event.summoner());
        if (level){
            actor_unit.changeLevel(level, false);
            actor_unit.recoverAll();
        }
        actor_unit.initTp(); //TPを初期化
        actor_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
        let bitmap = ImageManager.loadFace(actor_unit.faceName()); //顔グラフィックをプリロードする
        $gameSystem.setEventToUnit(event.eventId(), 'actor', actor_unit);
        event.setType('actor');
        actor_unit.setBattleMode(mode);
        $gameMap.setEventImages();
        return actor_unit;
    };

    // modified by OhisamaCraft
    Game_Interpreter.prototype.addSummonEnemy = function(eventId, enemyId, mode) {
        var enemy_unit = new Game_Enemy(enemyId, 0, 0);
        var event = $gameMap.event(eventId);
        var mode = mode ? mode : 'normal';
        enemy_unit.setSummoner(event.summoner());
        enemy_unit.initTp(); //TPを初期化
        enemy_unit.setSrpgEventId(event.eventId()); // バトラー情報にイベントIDを入れておく
        var faceName = enemy_unit.enemy().meta.faceName; //顔グラフィックをプリロードする
        if (faceName) {
            var bitmap = ImageManager.loadFace(faceName);
        } else if ($gameSystem.isSideView()) {
            var bitmap = ImageManager.loadSvEnemy(enemy_unit.battlerName());
        } else {
            var bitmap = ImageManager.loadEnemy(enemy_unit.battlerName());
        }
        $gameSystem.setEventToUnit(event.eventId(), 'enemy', enemy_unit);
        event.setType('enemy');
        enemy_unit.setBattleMode(mode);
        $gameMap.setEventImages();
        const oldValue = $gameVariables.value(_existEnemyVarID);
        $gameVariables.setValue(_existEnemyVarID, oldValue + 1);
        return true;
    };

    //summon validity
    Game_Map.prototype.canSummon = function(type, summonId, battlerId, x, y) {
        if (!$gameMap.isValid(x,y)) return;
        if (type == 'actor' || type == 'enemy') {
            if (!$gameMap.positionIsOpen(x, y)) return;
            //var battler = (type == 'actor' ? $gameActors.actor(battlerId) : new Game_Enemy(battlerId, 0, 0));
            //if ($gameMap.terrainTag(x, y) <= battler.srpgThroughTag()) return true;
            return $gameMap.fourDirectionPassable(x, y);
        }
        var priority = $dataSummon.events[summonId].pages[0].priorityType;
        return $gameMap.eventsXyNt(x, y).every(function(event) {
            return event._priorityType != priority;
        });
    };

    Game_Map.prototype.fourDirectionPassable = function(x, y) {
        for (var d = 2; d < 10; d+=2){
            if (!this.isPassable(x, y, d)) return false;
        }
        return true;
    };

    Game_System.prototype.EventToUnit = function(event_id) {
        var battlerArray = this._EventToUnit[event_id];
        if (!battlerArray) return;
        if ((typeof battlerArray[1]) === 'number') {
            var actor = $gameActors.actor(battlerArray[1]);
            return [battlerArray[0], actor]
        } else {
            return battlerArray;
        }
    };

    Game_System.prototype.updateEnemySummonedEvents = function(){
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_SummonEvent && !event.isErased()) {
                if (event.summoner() && event.summoner().isEnemy()) event.updateTurns();
            }
        });
    }

    Game_System.prototype.updateActorSummonedEvents = function(){
        $gameMap.events().forEach(function(event) {
            if (event instanceof Game_SummonEvent && !event.isErased()) {
                if (event.summoner() && event.summoner().isActor()) event.updateTurns();
            }
        });
    }

    var _Game_System_srpgStartActorTurn = Game_System.prototype.srpgStartActorTurn;
    Game_System.prototype.srpgStartActorTurn = function(){
        _Game_System_srpgStartActorTurn.call(this);
        this.updateActorSummonedEvents();
    }

    var _Game_System_srpgStartEnemyTurn = Game_System.prototype.srpgStartEnemyTurn;
    Game_System.prototype.srpgStartEnemyTurn = function(){
        _Game_System_srpgStartEnemyTurn.call(this);
        this.updateEnemySummonedEvents();
    }

    Game_System.prototype.refreshSrpgAllActors = function() {
        for (i = this._srpgAllActors.length-1; i >= 0; i--){
            var actor = $gameSystem.EventToUnit(this._srpgAllActors[i])[1];
            if (actor.isDead() && actor.isSummonedBattler()){
                this._srpgAllActors.splice(i, 1);
            }
        }
    };

    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        if ($gameSystem.isSRPGMode() == true && $gameSystem.isBattlePhase() !== 'battle_prepare') {
            $gameSystem.refreshSrpgAllActors();
        }
        _Scene_Menu_createCommandWindow.call(this);
    };

    Game_Party.prototype.existingMemberNumber = function() {
        var existingMembers = this.allmembers().filter(function(member) {
            return member.isAlive() && !member.isSummonedBattler();
        });
        return existingMembers.length
    }

    var _Game_Party_menuActor = Game_Party.prototype.menuActor
    Game_Party.prototype.menuActor = function() {
        if ($gameSystem.isSRPGMode() && this._menuActor){
            return this._menuActor;
        } else return _Game_Party_menuActor.call(this);
    };

    var _Game_Party_setMenuActor = Game_Party.prototype.setMenuActor
    Game_Party.prototype.setMenuActor = function(actor) {
        _Game_Party_setMenuActor.call(this, actor);
        if ($gameSystem.isSRPGMode()) this._menuActor = actor;
    };

    Game_Map.prototype.addEvent = function(eventId, event){
        this._events[eventId] = event;
    }

    Game_Map.prototype.nextEventId = function(){
        //return this._events.length;
        return this.isMaxEventId() + 1;
    }

    Game_Battler.prototype.summoner = function(){
        return this._summoner;
    }

    Game_Battler.prototype.isSummonedBattler = function(){
        return this._summoner !== undefined;
    }

    Game_Battler.prototype.setSummoner = function(battler){
        this._summoner = battler;
    }

    var _Game_Actor_event = Game_Actor.prototype.event
    Game_Actor.prototype.event = function() {
        if (this.isSummonedBattler()){
            return Game_BattlerBase.prototype.event.call(this);
        } else return _Game_Actor_event.call(this);
    };

    // modified by OhisamaCraft
    // MZではactionの中にsubject(actor/enemy)を保管するとセーブ実行時にエラーを起こすため
    // 仕組みを変更している
    const _Game_Action_initialize = Game_Action.prototype.initialize;
    Game_Action.prototype.initialize = function(subject, forcing) {
        if ($gameSystem.isSRPGMode()) this._subjectEventId = subject.srpgEventId();
        _Game_Action_initialize.call(this, subject, forcing);
    };

    //the original set subject and subject makes no sense.
    /*
    var _Game_Action_setSubject = Game_Action.prototype.setSubject;
    Game_Action.prototype.setSubject = function(subject) {
        _Game_Action_setSubject.call(this, subject);
        this._subject = subject;
    };
    */

    const _SRPG_Game_Action_subject = Game_Action.prototype.subject;
    Game_Action.prototype.subject = function() {
        if ($gameSystem.isSRPGMode()) {
            const battlerArray = $gameSystem.EventToUnit(this._subjectEventId);
            return battlerArray[1];
        } else {
            return _SRPG_Game_Action_subject.call(this);
        }
    };

    Game_SummonEvent.prototype.initialize = function(mapId, eventId, summonEventId, summoner, turn, x, y) {
        Game_Character.prototype.initialize.call(this);
        this._mapId = mapId;
        this._eventId = eventId;
        this._summonEventId = summonEventId;
        this._summoner = summoner;
        this._turns = turn;
        this.locate(x, y);
        this.refresh();
    };

    Game_SummonEvent.prototype.event = function() {
        return $dataSummon.events[this._summonEventId];
    };

    Game_SummonEvent.prototype.summoner = function() {
        return this._summoner;
    };

    Game_SummonEvent.prototype.updateTurns = function() {
        if (this._turns < 10000) this._turns -=1;
        if (this._turns <= 0){
            var battleArray = $gameSystem.EventToUnit(this.eventId())
            if (battleArray && battleArray[1] && battleArray[1].isAlive()){
                battleArray[1].addState(battleArray[1].deathStateId())
                if (battleArray[1].isActor()) {
                    var oldValue = $gameVariables.value(_existActorVarID);
                    $gameVariables.setValue(_existActorVarID, oldValue - 1);
                } else {
                    var oldValue = $gameVariables.value(_existEnemyVarID);
                    $gameVariables.setValue(_existEnemyVarID, oldValue - 1);
                }
            }
            $gameTemp.requestAnimation([this], _disappearAnimation);
            this.erase();
        }
    };

    // modified by OhisamaCraft
    // 新規のスプライトを追加するだけにして、処理を軽量化する
    Spriteset_Map.prototype.addCharacter = function(event) {
        const sprite = new Sprite_Character(event);
        this._characterSprites.push(sprite);
        this._tilemap.addChild(sprite);
    };

})();
