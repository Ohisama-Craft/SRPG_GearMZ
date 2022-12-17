//-----------------------------------------------------------------------------
// SRPG_RangeControl_MZ.js
// Copyright (c) 2020 SRPG Team. All rights reserved.
// Released under the MIT license.
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @target MZ
 * @plugindesc SRPG line of sight, passability, variable range, and more, edited by OhisamaCraft.
 * @author Dr. Q
 *
 *
 * @param Range
 *
 * @param Default Range
 * @desc Range for weapons and skills if not specified
 * @parent Range
 * @type number
 * @min 0
 * @default 1
 *
 * @param Default Min Range
 * @desc Minimum range for weapons and skills if not specified
 * @parent Range
 * @type number
 * @min 0
 * @default 0
 *
 *
 * @param Line of Sight
 *
 * @param Through Objects
 * @desc If true, objects don't block LoS
 * @parent Line of Sight
 * @type boolean
 * @default false
 *
 * @param Through Opponents
 * @desc If true, the users's enemies don't block LoS
 * @parent Line of Sight
 * @type boolean
 * @default false
 *
 * @param Through Friends
 * @desc If true, the users's allies don't block LoS
 * @parent Line of Sight
 * @type boolean
 * @default true
 *
 * @param Through Events
 * @desc If true, playerEvents don't block LoS
 * @parent Line of Sight
 * @type boolean
 * @default false
 *
 * @param Through Terrain
 * @desc Terrain IDs above this number block line of sight
 * -1 uses the same setting as the user's mobility
 * @parent Line of Sight
 * @type number
 * @min -1
 * @max 7
 * @default 0
 *
 *
 * @param Unit Passability
 *
 * @param Block Friends
 * @desc If true, units block their friends' movement
 * @parent Unit Passability
 * @type boolean
 * @default false
 *
 * @param Block Opponents
 * @desc If true, units block their opponents' movement
 * @parent Unit Passability
 * @type boolean
 * @default true
 *
 *
 * @param Event Passability
 *
 * @param Block Units
 * @desc if true, playerEvents block units' movement
 * @parent Event Passability
 * @type boolean
 * @default false
 *
 *
 * @param Zone of Control
 *
 * @param Base ZoC
 * @desc Initial ZoC value for all units
 * Modified by srpgZoC tags
 * @parent Zone of Control
 * @type number
 * @min 0
 * @default 0
 *
 * @param Base Through ZoC
 * @desc Initial Through ZoC value for all units
 * Modified by srpgThroughZoC tags
 * @parent Zone of Control
 * @type number
 * @min 0
 * @default 0
 *
 *
 * @param Terrain Cost
 *
 * @param Terrain 0 Cost
 * @desc Movement cost of terrain tag 0
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 1 Cost
 * @desc Movement cost of terrain tag 1
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 2 Cost
 * @desc Movement cost of terrain tag 2
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 3 Cost
 * @desc Movement cost of terrain tag 3
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 4 Cost
 * @desc Movement cost of terrain tag 4
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 5 Cost
 * @desc Movement cost of terrain tag 5
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 6 Cost
 * @desc Movement cost of terrain tag 6
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 7 Cost
 * @desc Movement cost of terrain tag 7
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 *
 * @help
 * Adds line of sight, modifiable ranges, passability options, zone of control,
 * and terrain-based movement costs for SRPG combat
 *
 * Zone of control (ZoC) in this plugin is the ability to prevent opponent units 
 * from passing through the 4 squares around the unit that has ZoC
 * (It is possible to be adjacent).
 * If an enemy unit's ZoC is higher than your Through ZoC, you are forced to stop
 * when you try to move past them. ZoC can be disabled with a larger value Through ZoC.
 * ZoC and Through ZoC cannot go below 0.
 *
 * Use plugin parameters to set the default line-of-sight rules.
 *
 * New actor and class notetags:
 * <srpgWeaponRange:X>           # specify default range if no weapon is equipped
 * <srpgWeaponMinRange:X>        # specify default minimum range if no weapon is equipped
 * <srpgWeaponSkill:X>           # specify normal attack skill ID if no weapon is equipped
 *
 * New actor, class, enemy, weapon, armor, state, and skill note tags:
 * <srpgZoC:X>                   # increases the unit's ZoC effect by X
 * <srpgThroughZoC:X>            # increases the unit's "through ZoC" by X
 * <blockFriends:true/false>     # if true, friends cannot move through you
 * <blockOpponents:true/false>   # if true, opponents cannot move through you
 * <srpgRangePlus:X>             # increases or decreases variable ranges by X
 * <srpgMovePlus:X>              # now works on actor, class, enemy, and skill notes
 * <passFriends>                 # unit can move through all friend units
 * <passOpponents>               # unit can move through all opponent units
 * <passEvents>                  # unit can move through playerEvents
 * <passObjects>                 # unit can move through all objects
 *
 * *blockFriends and blockOpponents use the value of the highest-priority tag:
 * states > equipment > skills > enemy > class > actor > plugin defaults
 * Units with passFriends and passOpponents have priority over blocking tags
 *
 * New skill / item notetags:
 * <srpgVariableRange>           # range will be affected by srpgRangePlus tags
 * <srpgLoS>                     # targets must be in line of sight from the user
 * <throughObject:true/false>    # if true, object events do not block line of sight
 * <throughFriend:true/false>    # if true, the user's allies do not block line of sight
 * <throughOpponent:true/false>  # if true, the user's enemies do not block line of sight
 * <throughEvent:true/false>     # if true, playerEvents do not block line of sight
 * <throughTerrain:X>            # terrain IDs above X block line of sight
 *                               -1 checks the user's srpgThroughTag instead
 *
 * New tilset / map notetags:
 * <srpgTerrainXCost:Y>          # sets the movement cost of terrain X to Y
 *                               X can be any number between 0 and 7
 *                               Y can be any decimal number > 1
 * 
 * Note / Modification by Ohisama Craft
 * -Supports specialRange: allActor, allEnemy
 * -Compatible with <srpgWRangePlus>
 * -Japanese translation of help
 *
 */

/*:ja
 * @target MZ
 * @plugindesc SRPG戦闘での射線（攻撃範囲の制限）、移動、射程の変更などを実装する(おひさまクラフトによる改変あり)。
 * @author Dr. Q
 *
 *
 * @param Range
 *
 * @param Default Range
 * @desc 指定が無い場合のデフォルトの武器・スキルの射程
 * @parent Range
 * @type number
 * @min 0
 * @default 1
 *
 * @param Default Min Range
 * @desc 指定が無い場合のデフォルトの武器・スキルの最低射程
 * @parent Range
 * @type number
 * @min 0
 * @default 0
 *
 *
 * @param Line of Sight
 *
 * @param Through Objects
 * @desc true（ON）にすると、objectユニットが射線（攻撃範囲）を遮らなくなる
 * @parent Line of Sight
 * @type boolean
 * @default false
 *
 * @param Through Opponents
 * @desc true（ON）にすると、エネミーユニットが射線（攻撃範囲）を遮らなくなる
 * @parent Line of Sight
 * @type boolean
 * @default false
 *
 * @param Through Friends
 * @desc true（ON）にすると、アクターユニットが射線（攻撃範囲）を遮らなくなる
 * @parent Line of Sight
 * @type boolean
 * @default true
 *
 * @param Through Events
 * @desc true（ON）にすると、プレイヤーイベントが射線（射程）を遮らなくなる
 * @parent Line of Sight
 * @type boolean
 * @default false
 *
 * @param Through Terrain
 * @desc 設定した数値以上のIDの地形タグは射線（攻撃範囲）を遮るようになる
 * -1に設定すると、使用者の移動力と同じ設定になる
 * @parent Line of Sight
 * @type number
 * @min -1
 * @max 7
 * @default 0
 *
 *
 * @param Unit Passability
 *
 * @param Block Friends
 * @desc true（ON）にすると、味方のユニットを通過して移動できなくなる
 * @parent Unit Passability
 * @type boolean
 * @default false
 *
 * @param Block Opponents
 * @desc true（ON）にすると、敵のユニットを通過して移動できなくなる
 * @parent Unit Passability
 * @type boolean
 * @default true
 *
 *
 * @param Event Passability
 *
 * @param Block Units
 * @desc true（ON）にすると、プレイヤーイベントを通過して移動できなくなる
 * @parent Event Passability
 * @type boolean
 * @default false
 *
 *
 * @param Zone of Control
 *
 * @param Base ZoC
 * @desc すべてのユニットにおける、ZoC値の初期値を設定する
 * Modified by srpgZoC tags
 * @parent Zone of Control
 * @type number
 * @min 0
 * @default 0
 *
 * @param Base Through ZoC
 * @desc すべてのユニットにおける、ZoCを通過できる値の初期値を設定する
 * Modified by srpgThroughZoC tags
 * @parent Zone of Control
 * @type number
 * @min 0
 * @default 0
 *
 *
 * @param Terrain Cost
 *
 * @param Terrain 0 Cost
 * @desc 地形タグ 0 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 1 Cost
 * @desc 地形タグ 1 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 2 Cost
 * @desc 地形タグ 2 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 3 Cost
 * @desc 地形タグ 3 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 4 Cost
 * @desc 地形タグ 4 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 5 Cost
 * @desc 地形タグ 5 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 6 Cost
 * @desc 地形タグ 6 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 * @param Terrain 7 Cost
 * @desc 地形タグ 7 の移動コスト（1.00が通常）
 * @parent Terrain Cost
 * @type number
 * @min 1.00
 * @decimals 2
 * @default 1.00
 *
 *
 * @help
 * SRPG戦闘において、射線（攻撃範囲の制限）、射程の変更、通行オプション、zone of control(ZoC)、
 * 地形タグによる移動コストの機能を追加する。
 * 
 * このプラグインにおける zone of control (ZoC) とは、設定されたユニットの周囲４マスを
 * 対立するユニットが通過できなくする能力です（隣接することは可能です）。
 * もしあるエネミーユニットの ZoC が行動中のアクターユニットの Through ZoC より高い場合、
 * そのアクターはエネミーの横を通り抜けて、先へ進むことが出来なくなります。
 * ZoC は、より大きい値の Through ZoC により無効化できます。
 * ZoC と Through ZoC の値は、0を下回ることは出来ません。
 * 
 * プラグインパラメータを利用して、デフォルトの射線（攻撃範囲の制限）を設定します。
 * たとえば、攻撃などの射程が敵のユニットを通過できなくしたりします。
 * 
 * おひさまクラフトによる改変
 * 和訳を追加、srpgWRangePlusに対応
 *
 * 新しいアクターと職業のメモ:
 * <srpgWeaponRange:X>           # 武器を装備していない場合の攻撃射程を指定します
 * <srpgWeaponMinRange:X>        # 武器を装備していない場合の最低攻撃射程を指定します
 * <srpgWeaponSkill:X>           # 武器を装備していない場合の通常攻撃のスキルIDを指定します
 *
 * 新しいアクター、職業、エネミー、武器、防具、ステート、スキルのメモ:
 * <srpgZoC:X>                   # X の値だけそのユニットのZoCを増加させる
 * <srpgThroughZoC:X>            # X の値だけそのユニットのthrough ZoCを増加させる
 * <blockFriends:true/false>     # trueにすると、味方のユニットはそのユニットを通過できなくなる
 * <blockOpponents:true/false>   # trueにすると、敵のユニットはそのユニットを通過できなくなる
 * <srpgRangePlus:X>             # <srpgVariableRange>が設定されたスキルの射程を X の値だけ増減します
 * <srpgMovePlus:X>              # 移動力を X の値だけ増減します
 * <passFriends>                 # そのユニットは、すべての味方のユニットを通過して移動できるようになります
 * <passOpponents>               # そのユニットは、すべての敵のユニットを通過して移動できるようになります
 * <passEvents>                  # そのユニットは、すべてのプレイヤーイベントを通過して移動できるようになります
 * <passObjects>                 # そのユニットは、すべてのobjectを通過して移動できるようになります
 *
 * *blockFriends と blockOpponents が複数ある場合、最も優先度の高いメモの設定が用いられます:
 * ステート > 装備 > スキル > エネミー > 職業 > アクター > プラグインのデフォルト
 * passFriends と passOpponents の設定は、blockよりも優先されます
 *
 * 新しいスキル、アイテムのメモ:
 * <srpgVariableRange>           # <srpgRangePlus:X>の影響を受けるようになります
 * <srpgLoS>                     # 射線（攻撃範囲の制限）の影響を受けるようになります
 * <throughObject:true/false>    # trueにすると、objectによって射線を遮られなくなります
 * <throughFriend:true/false>    # trueにすると、味方のユニットによって射線を遮られなくなります
 * <throughOpponent:true/false>  # trueにすると、敵のユニットによって射線を遮られなくなります
 * <throughEvent:true/false>     # trueにすると、プレイヤーイベントによって射線を遮られなくなります
 * <throughTerrain:X>            # X より上のIDの地形タグによって射線を遮られなくなります
 *                               -1 にすると、代わりに使用者のsrpgThroughTagを利用します
 *
 * 新しいタイルセット、マップのメモ:
 * <srpgTerrainXCost:Y>          # 地形タグ X の移動コストを Y にします。
 *                                 Xには、0 ~ 7 の数値を設定できます
 *                                 Yには、1 より大きな自然数を設定できます
 * 
 * 注 / おひさまクラフトによる改変内容 ('modified by OhisamaCraft'で検索)
 * ・specialRange:allActor, allEnemyに対応
 * ・<srpgWRangePlus>に対応
 * ・ヘルプの和訳
 *
 */

(function(){
	var parameters = PluginManager.parameters('SRPG_RangeControl_MZ');
	var _defaultRange = Number(parameters['Default Range'] || 0);
	var _defaultMinRange = Number(parameters['Default Min Range'] || 1);
	var _defaultTag = Number(parameters['Through Terrain'] || 0);
	var _throughObject = !!eval(parameters['Through Objects']);
	var _throughOpponent = !!eval(parameters['Through Opponents']);
	var _throughFriend = !!eval(parameters['Through Friends']);
	var _throughEvent = !!eval(parameters['Through Events']);
	var _blockFriends = !!eval(parameters['Block Friends']);
	var _blockOpponents = !!eval(parameters['Block Opponents']);
	var _eventBlockUnits = !!eval(parameters['Block Units']);
	var _baseZoc = Number(parameters['Base ZoC'] || 0);
	var _baseThroughZoc = Number(parameters['Base Through ZoC'] || 0);
	var _terrainCost = [];
	for (var i = 0; i < 8; i++) {
		_terrainCost[i] = Number(parameters['Terrain '+i+' Cost'] || 1.0);
	}

	var coreParameters = PluginManager.parameters('SRPG_core_MZ');
	var _defaultMove = Number(coreParameters['defaultMove'] || 4);
	var _srpgBestSearchRouteSize = Number(coreParameters['srpgBestSearchRouteSize'] || 25);

//====================================================================
// utility functions
//====================================================================

	// (utility) distance between two points on the map, accounts for looping
	Game_Map.prototype.distTo = function(x1, y1, x2, y2) {
		var dx = Math.abs(x1 - x2);
		var dy = Math.abs(y1 - y2);

		if (this.isLoopHorizontal()) dx = Math.min(dx, this.width() - dx);
		if (this.isLoopVertical()) dy = Math.min(dy, this.height() - dy);

		return  dx + dy;
	};

	// check the value of a tag
	Game_BattlerBase.prototype.tagValue = function(type) {
		var n = 0;
		this.states().forEach(function(state) {
			if (state && state.meta[type]) {
				n += Number(state.meta[type]);
			}
		});
		return n;
	};
	Game_Actor.prototype.tagValue = function(type) {
		var n = Game_BattlerBase.prototype.tagValue.call(this, type);
		if (this.actor().meta[type]) n += Number(this.actor().meta[type]);
		if (this.currentClass().meta[type]) n += Number(this.currentClass().meta[type]);
		this.equips().forEach(function(item) {
			if (item && item.meta[type]) {
				n += Number(item.meta[type]);
			}
		});
		this.skills().forEach(function(skill) {
			if (skill && skill.meta[type]) {
				n += Number(skill.meta[type]);
			}
		});
		return n;
	};
	Game_Enemy.prototype.tagValue = function(type) {
		var n = Game_BattlerBase.prototype.tagValue.call(this, type);
		if (this.enemy().meta[type]) n += Number(this.enemy().meta[type]);
		if (!this.hasNoWeapons()) {
			var weapon = $dataWeapons[this.enemy().meta.srpgWeapon];
			if (weapon && weapon.meta[type]) n += Number(weapon.meta[type]);
		}
		return n;
	};

	// check for the highest priority tag
	Game_BattlerBase.prototype.priorityTag = function(type) {
		var t;
		this.states().some(function(state) {
			if (state && state.meta[type]) {
				t = state.meta[type];
				return true;
			}
			return false;
		});
		return t;
	};
	Game_Actor.prototype.priorityTag = function(type) {
		var t = Game_BattlerBase.prototype.priorityTag.call(this, type);
		if (t) return t;
		this.equips().some(function(item) {
			if (item && item.meta[type]) {
				t = item.meta[type];
				return true;
			}
			return false;
		});
		if (t) return t;
		this.skills().some(function(skill) {
			if (skill && skill.meta[type]) {
				t = skill.meta[type];
				return true;
			}
			return false;
		});
		if (t) return t;
		if (this.currentClass().meta[type]) return this.currentClass().meta[type];
		if (this.actor().meta[type]) return this.actor().meta[type];
	};
	Game_Enemy.prototype.priorityTag = function(type) {
		var t = Game_BattlerBase.prototype.priorityTag.call(this, type);
		if (t) return t;
		if (!this.hasNoWeapons()) {
			var weapon = $dataWeapons[this.enemy().meta.srpgWeapon];
			if (weapon && weapon.meta[type]) return weapon.meta[type];
		}
		if (this.enemy().meta[type]) return this.enemy().meta[type];
	};

//====================================================================
// improved range calculations
//====================================================================

	// breadth-first search for movement
	Game_CharacterBase.prototype.makeMoveTable = function(x, y, move, unused, tag) {
		var edges = [];
		if (move > 0) edges = [[x, y, move, [0]]];
		$gameTemp.setMoveTable(x, y, move, [0]);
		$gameTemp.pushMoveList([x, y, false]);
		$gameMap.makeSrpgZoCTable(this.isType() == 'actor' ? 'enemy' : 'actor', this.throughZoC());

		while (edges.length > 0) {
			var cell = edges.shift();
			for (var d = 2; d < 10; d += 2) {
				if (!this.srpgMoveCanPass(cell[0], cell[1], d, tag)) continue;

				var dx = $gameMap.roundXWithDirection(cell[0], d);
				var dy = $gameMap.roundYWithDirection(cell[1], d);
				if ($gameTemp.MoveTable(dx, dy)[0] >= 0) continue;
				var dmove = Math.max(cell[2] - $gameMap.srpgMoveCost(dx, dy), 0);

				var route = cell[3].concat(d);
				$gameTemp.setMoveTable(dx, dy, dmove, route);
				$gameTemp.pushMoveList([dx, dy, false]);
				if (dmove > 0 && !$gameMap._zocTable[dx+','+dy]) {
					edges.push([dx, dy, dmove, route]);
					edges.sort(function (a, b) {
						return b[2] - a[2];
					});
				}
			}
		}
	}

	// get the cost of moving through a given space
	Game_Map.prototype.srpgMoveCost = function(x, y) {
		var terrain = this.terrainTag(x, y);

		// map tags
		if ($dataMap.meta["srpgTerrain"+terrain+"Cost"]) {
			return Number($dataMap.meta["srpgTerrain"+terrain+"Cost"] || 1);
		}

		// tileset tags
		if (this.tileset().meta["srpgTerrain"+terrain+"Cost"]) {
			return Number(this.tileset().meta["srpgTerrain"+terrain+"Cost"] || 1);
		}

		// plugin parameters
		return _terrainCost[terrain];
	};

	// breadth-first search for range
	// modified by OhisamaCraft
	Game_CharacterBase.prototype.makeRangeTable = function(x, y, range, unused, oriX, oriY, skill) {
		var user = $gameSystem.EventToUnit(this.eventId())[1];
		if (!skill || !user) return;
		var minRange = user.srpgSkillMinRange(skill);

		// all actor or enemy
		if (skill.meta.specialRange === 'allActor' || skill.meta.specialRange === 'allEnemy') {
			this.makeAllRangeTableAndList(skill, x, y);
			return;
		}

		// normal range
		var edges = [];
		if (range > 0) edges = [[x, y, range, [0], []]];
		if (minRange <= 0 && $gameTemp.RangeTable(x, y)[0] < 0) {
			if ($gameTemp.MoveTable(x, y)[0] < 0) $gameTemp.pushRangeList([x, y, true]);
			$gameTemp.setRangeTable(x, y, range, [0]);
			$gameTemp.addRangeMoveTable(x, y, x, y);
		}
		$gameMap.makeSrpgLoSTable(this);
		
		for (var i = 0; i < edges.length; i++) {
			var cell = edges[i];
			var drange = cell[2] - 1;
			for (var d = 2; d < 10; d += 2) {
				if (cell[4][d] == 1) continue;
				if (!this.srpgRangeCanPass(cell[0], cell[1], d)) continue;

				var dx = $gameMap.roundXWithDirection(cell[0], d);
				var dy = $gameMap.roundYWithDirection(cell[1], d);
				var route = cell[3].concat(d);
				var forward = cell[4].slice(0);
				forward[10-d] = 1;
				if (drange > 0) edges.push([dx, dy, drange, route, forward]);

				if ($gameMap.distTo(x, y, dx, dy) >= minRange && this.srpgRangeExtention(dx, dy, x, y, skill, range)) {
					if ($gameTemp.RangeTable(dx, dy)[0] < 0) {
						$gameTemp.setRangeTable(dx, dy, drange, route);
						if ($gameTemp.MoveTable(dx, dy)[0] < 0) $gameTemp.pushRangeList([dx, dy, true]);
					}
					$gameTemp.addRangeMoveTable(dx, dy, x, y);
				}
			}
		}
	};

	// check line-of-sight as part of the special range
	var _srpgRangeExtention = Game_CharacterBase.prototype.srpgRangeExtention;
	Game_CharacterBase.prototype.srpgRangeExtention = function(x, y, oriX, oriY, skill, range) {
		if (!_srpgRangeExtention.apply(this, arguments)) return false;
		if (skill && skill.meta.srpgLoS) {
			return $gameMap.srpgHasLoS(oriX, oriY, x, y, this.LoSTerrain(skill), this.LoSEvents(skill));
		}
		return true;
	}

	// 全体射程の射程範囲を作成する
	// modified by OhisamaCraft
	Game_CharacterBase.prototype.makeAllRangeTableAndList = function(skill, x, y) {
		$gameMap.events().forEach(function(event) {
            if ((skill.meta.specialRange === 'allActor' && 
				 event.isType() === 'actor' && !event.isErased()) ||
				(skill.meta.specialRange === 'allEnemy' && 
				 event.isType() === 'enemy' && !event.isErased()) ) {
				var dx = event.posX();
				var dy = event.posY();
				if ($gameTemp.RangeTable(dx, dy)[0] < 0) {
					$gameTemp.setRangeTable(dx, dy, 0, []);
					if ($gameTemp.MoveTable(dx, dy)[0] < 0) $gameTemp.pushRangeList([dx, dy, true]);
				}
				$gameTemp.addRangeMoveTable(dx, dy, x, y);
            }
        });
	}

	// Build the move+range table more efficiently
	Game_System.prototype.srpgMakeMoveTable = function(event) {
		var user = $gameSystem.EventToUnit(event.eventId())[1];
		var item = null;
		if (user.action(0) && user.action(0).item()) item = user.action(0).item();
		else item = $dataSkills[user.attackSkillId()];

		$gameTemp.clearMoveTable();
		if ($gameTemp.isSrpgSearchLongDistance() === true) {
			event.makeMoveTable(event.posX(), event.posY(), _srpgBestSearchRouteSize, null, user.srpgThroughTag());
		} else {
			event.makeMoveTable(event.posX(), event.posY(), user.srpgMove(), null, user.srpgThroughTag());
		}
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

	// stores the original position for use in quick targeting and AI
	Game_Temp.prototype.addRangeMoveTable = function(x, y, oriX, oriY) {
		this._RangeMoveTable[x][y].push({x: oriX, y: oriY});
	};
	Game_Temp.prototype.RangeMoveTable = function(x, y) {
		return this._RangeMoveTable[x][y];
	};

	// clear the new table together with the rest
	var _clearMoveTable = Game_Temp.prototype.clearMoveTable;
	Game_Temp.prototype.clearMoveTable = function() {
		_clearMoveTable.call(this);
		this._RangeMoveTable = [];
		for (var i = 0; i < $dataMap.width; i++) {
			var col = [];
			for (var j = 0; j < $dataMap.height; j++) {
				col[j] = [];
			}
			this._RangeMoveTable[i] = col;
		}
	};

	// these functions aren't necessary anymore
	Game_Temp.prototype.initialMoveTable = function(oriX, oriY, oriMove) {
		return;
	}
	Game_Temp.prototype.initialRangeTable = function(oriX, oriY, oriMove) {
		return;
	}
	Game_Temp.prototype.minRangeAdapt = function(oriX, oriY, minRange) {
		return;
	};

//====================================================================
// line of sight checks
//====================================================================

	// map out the events that might block LoS
	Game_Map.prototype.makeSrpgLoSTable = function(source) {
		var losTable = {};
		this.events().forEach(function(event) {
			if (event !== source && !event.isErased() && event.isType()) {
				switch (event.isType()) {
					case 'object':
						if (event.characterName() == '') break;
					case 'actor':
					case 'enemy':
					case 'playerEvent':
						losTable[event.posX()+','+event.posY()] = event.isType();
						break;
				}
			}
		});
		this._losTable = losTable;
	};

	// terrain tag this skill can pass over (-1 to get the user's movement)
	Game_CharacterBase.prototype.LoSTerrain = function(skill) {
		if (skill.meta.throughTerrain === undefined) return _defaultTag;
		var terrain = Number(skill.meta.throughTerrain);
		if (terrain < 0) {
			return $gameSystem.EventToUnit(this.eventId())[1].srpgThroughTag();
		}
		return terrain;
	};

	// list of event types that block LoS for this skill
	Game_CharacterBase.prototype.LoSEvents = function(skill) {
		var blockingTypes = [];
		if ((!_throughObject && skill.meta.throughObject != "true") || skill.meta.throughObject == "false") {
			blockingTypes.push("object");
		}
		if ((!_throughFriend && skill.meta.throughFriend != "true") || skill.meta.throughFriend == "false") {
			blockingTypes.push((this.isType() != "enemy") ? "actor" : "enemy");
		}
		if ((!_throughOpponent && skill.meta.throughOpponent != "true") || skill.meta.throughOpponent == "false") {
			blockingTypes.push((this.isType() != "enemy") ? "enemy" : "actor");
		}
		if ((!_throughEvent && skill.meta.throughEvent != "true") || skill.meta.throughEvent == "false") {
			blockingTypes.push("playerEvent");
		}
		return blockingTypes;
	};

	// trace the line from x,y to x2,y2 and return false if the path is blocked
	Game_Map.prototype.srpgHasLoS = function(x1, y1, x2, y2, tag, types) {
		tag = Math.max(tag, 0);
		var dx = Math.abs(x2 - x1);
		var dy = Math.abs(y2 - y1);
		var sx = (x1 < x2) ? 1 : -1;
		var sy = (y1 < y2) ? 1 : -1;

		// go around the other way for looping maps
		if (this.isLoopHorizontal() && dx > this.width() / 2) {
			dx = this.width() - dx;
			sx *= -1;
		}
		if (this.isLoopVertical() && dy > this.height() / 2) {
			dy = this.height() - dy;
			sy *= -1;
		}

		var path = {};
		var x = x1;
		var y = y1;
		var err = dx - dy;
		while (x != x2 || y != y2) {
			var err2 = err << 1;
			// move horizontally
			if (err2 > -dy) {
				err -= dy;
				x += sx;
				if (x < 0) x += this.width();
				if (x >= this.width()) x -= this.width();
			}
			// move vertically
			if (err2 < dx) {
				err += dx;
				y += sy;
				if (y < 0) y += this.height();
				if (y >= this.height()) y -= this.height();
			}
			// check if sight is blocked
			if (this.terrainTag(x, y) > tag) return false;
			if (x != x2 || y != y2 || this._losTable[x+','+y] == 'object') {
				if (types.contains(this._losTable[x+','+y])) return false;
			}
		}
		return true;
	};

//====================================================================
// collision during movement
//====================================================================

	// finer control over passability checks
	Game_CharacterBase.prototype.isSrpgCollidedWithEvents = function(x, y) {
		var events = $gameMap.events();
		var friendType = $gameTemp.activeEvent().isType();
		var opponentType = $gameTemp.activeEvent().isType() === 'actor' ? 'enemy' : 'actor';
		var passFriends = $gameTemp.activeEvent().passFriends();
		var passOpponents = $gameTemp.activeEvent().passOpponents();
		var passEvents = $gameTemp.activeEvent().passEvents();
		var passObjects = $gameTemp.activeEvent().passObjects();
		return events.some(function(event) {
			if (event.isErased() || !event.pos(x, y)) return false;
			if (event === $gameTemp.activeEvent()) return false;
			if (event.isType() === 'object' && !passObjects && event.characterName() != '') return true;
			if (event.isType() === 'playerEvent' && !passEvents && event.blocksUnits()) return true;
			if (event.isType() === friendType && !passFriends && event.blocksFriends()) return true;
			if (event.isType() === opponentType && !passOpponents && event.blocksOpponents()) return true;
			return false;
		});
	};

	// determine which units a character blocks
	Game_CharacterBase.prototype.blocksFriends = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (unitAry) {
			var block = unitAry[1].priorityTag('blockFriends');
			if (block) return !!eval(block);
		}
		return _blockFriends;
	};
	Game_CharacterBase.prototype.blocksOpponents = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (unitAry) {
			var block = unitAry[1].priorityTag('blockOpponents');
			if (block) return !!eval(block);
		}
		return _blockOpponents;
	};
	Game_CharacterBase.prototype.blocksUnits = function() {
		return (this.isType && this.isType() === 'playerEvent' && _eventBlockUnits);
	};
	// determine which events a character ignores
	Game_CharacterBase.prototype.passFriends = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (unitAry) {
			var pass = unitAry[1].priorityTag('passFriends');
			if (pass) return !!eval(pass);
		}
		return false;
	};
	Game_CharacterBase.prototype.passOpponents = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (unitAry) {
			var pass = unitAry[1].priorityTag('passOpponents');
			if (pass) return !!eval(pass);
		}
		return false;
	};
	Game_CharacterBase.prototype.passEvents = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (unitAry) {
			var pass = unitAry[1].priorityTag('passEvents');
			if (pass) return !!eval(pass);
		}
		return false;
	};
	Game_CharacterBase.prototype.passObjects = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (unitAry) {
			var pass = unitAry[1].priorityTag('passObjects');
			if (pass) return !!eval(pass);
		}
		return false;
	};

	// make sure you don't move onto an enemy
	var _triggerAction = Game_Player.prototype.triggerAction;
	Game_Player.prototype.triggerAction = function() {
		// TODO: Only if a valid movement position?
		if ($gameSystem.isSRPGMode() && $gameSystem.isSubBattlePhase() === 'actor_move' && 
		(Input.isTriggered('ok') || TouchInput.isTriggered()) &&
		!$gameSystem.areTheyNoUnits(this._x, this._y, 'enemy')) {
			SoundManager.playBuzzer();
			return true;
		}
		else _triggerAction.call(this);
	};

//====================================================================
// zone of control checks
//====================================================================

	// map out the zones of control
	Game_Map.prototype.makeSrpgZoCTable = function(type, through) {
		var zocTable = {};
		this.events().forEach(function(event) {
			if (!event.isErased() && event.isType() === type && event.ZoC() > through) {
				zocTable[(event.posX()+1)+','+event.posY()] = true;
				zocTable[event.posX()+','+(event.posY()+1)] = true;
				zocTable[(event.posX()-1)+','+event.posY()] = true;
				zocTable[event.posX()+','+(event.posY()-1)] = true;
			}
		});
		this._zocTable = zocTable;
	};

	// calculate the ZoC level around an event
	Game_CharacterBase.prototype.ZoC = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (!unitAry) return 0;
		return Math.max(unitAry[1].ZoC(), 0);
	};

	// check if an event can move through ZoC
	Game_CharacterBase.prototype.throughZoC = function() {
		var unitAry = $gameSystem.EventToUnit(this.eventId());
		if (!unitAry) return 0;
		return Math.max(unitAry[1].throughZoC(), 0);
	};

	// check ZoC
	Game_BattlerBase.prototype.ZoC = function() {
		return this.tagValue("srpgZoC") + _baseZoc;
	};
	// check through ZoC
	Game_BattlerBase.prototype.throughZoC = function() {
		return this.tagValue("srpgThroughZoC") + _baseThroughZoc;
	};

//====================================================================
// modifiable ranges
// modified by OhisamaCraft
//====================================================================

	// check range bonuses
	Game_BattlerBase.prototype.srpgRangePlus = function() {
		return this.tagValue("srpgRangePlus");
	};

	Game_BattlerBase.prototype.srpgWRangePlus = function() {
		return this.tagValue("srpgWRangePlus");
	};

	// re-define minimum range to work with adjustable maximum range
	Game_Actor.prototype.srpgSkillMinRange = function(skill) {
		if (!skill) return _defaultMinRange;

		if (skill.meta.srpgRange == -1) {
			if (!this.hasNoWeapons()) {
				var weapon = this.weapons()[0];
				if (weapon && weapon.meta.weaponMinRange) return Number(weapon.meta.weaponMinRange);
			} else if (this.currentClass().meta.weaponMinRange) {
				return Number(this.currentClass().meta.weaponMinRange);
			} else if (this.actor().meta.weaponMinRange) {
				return Number(this.actor().meta.weaponMinRange);
			} else {
				return _defaultMinRange;
			}
		} else if (skill.meta.srpgMinRange) {
			return Number(skill.meta.srpgMinRange);
		}
		return _defaultMinRange;
	};
	Game_Enemy.prototype.srpgSkillMinRange = function(skill) {
		if (!skill) return _defaultMinRange;

		if (skill.meta.srpgRange == -1) {
			if (!this.hasNoWeapons()) {
				var weapon = $dataWeapons[this.enemy().meta.srpgWeapon];
				if (weapon && weapon.meta.weaponMinRange) return Number(weapon.meta.weaponMinRange);
			} else if (this.enemy().meta.weaponMinRange) {
				return Number(this.enemy().meta.weaponMinRange);
			}
		} else if (skill.meta.srpgMinRange) {
			return Number(skill.meta.srpgMinRange);
		}
		return _defaultMinRange;
	};

	// apply the bonuses to the maximum range
	Game_Actor.prototype.srpgSkillRange = function(skill) {
		var range = _defaultRange;
		if (skill && skill.meta.srpgRange) {
            var range = Number(skill.meta.srpgRange);
        }
        var rangeWeapon = (range === -1) ? true : false;

		if (rangeWeapon) {
			if (!this.hasNoWeapons()) {
				var weapon = this.weapons()[0];
				if (weapon.meta.weaponRange) range = Number(weapon.meta.weaponRange);
			} else if (this.currentClass().meta.weaponRange) {
				range = Number(this.currentClass().meta.weaponRange);
			} else if (this.actor().meta.weaponRange) {
				range = Number(this.actor().meta.weaponRange);
			}
		}

		if (range === -1) range = 1;
        if (rangeWeapon) {
			var wRangeMod = this.srpgWRangePlus();
            range += wRangeMod;
        }
		var minRange = this.srpgSkillMinRange(skill);
		var rangeMod = this.srpgRangePlus();
		if (skill.meta.srpgVariableRange) {
			range += rangeMod;
		}
		return Math.max(range, minRange);
	};
	Game_Enemy.prototype.srpgSkillRange = function(skill) {
		var range = _defaultRange;
		if (skill && skill.meta.srpgRange) {
            var range = Number(skill.meta.srpgRange);
        }
        var rangeWeapon = (range === -1) ? true : false;

		if (rangeWeapon) {
			if (!this.hasNoWeapons()) {
				var weapon = $dataWeapons[this.enemy().meta.srpgWeapon];
				if (weapon && weapon.meta.weaponRange) {
                    range = Number(weapon.meta.weaponRange);
                } else if (this.enemy().meta.weaponRange) {
                    range = Number(this.enemy().meta.weaponRange);
                }
			} else if (this.enemy().meta.weaponRange) {
				range = Number(this.enemy().meta.weaponRange);
			}
		}

		if (range === -1) range = 1;
        if (rangeWeapon) {
            var wRangeMod = this.srpgWRangePlus();
            range += wRangeMod;
        }

		var minRange = this.srpgSkillMinRange(skill);
		var rangeMod = this.srpgRangePlus();
		if (skill.meta.srpgVariableRange) {
			range += rangeMod;
		}
		return Math.max(range, minRange);
	};

	// weapon skill can be set from actor or skill
	Game_Actor.prototype.attackSkillId = function() {
		var weapon = this.weapons()[0];
		if (weapon && weapon.meta.srpgWeaponSkill) {
			return Number(weapon.meta.srpgWeaponSkill);
		} else if (this.currentClass().meta.srpgWeaponSkill) {
			return Number(this.currentClass().meta.srpgWeaponSkill);
		} else if (this.actor().meta.srpgWeaponSkill) {
			return Number(this.actor().meta.srpgWeaponSkill);
		} else {
			return Game_BattlerBase.prototype.attackSkillId.call(this);
		}
	};

//====================================================================
// update where move ranges can come from
//====================================================================

	// update the move range calculation to 
	Game_Actor.prototype.srpgMove = function() {
		var n = _defaultMove;
		if (this.currentClass().meta.srpgMove) {
			n = Number(this.currentClass().meta.srpgMove);
		} else if (this.actor().meta.srpgMove) {
			n = Number(this.actor().meta.srpgMove);
		}
		n += this.tagValue("srpgMovePlus");
		return Math.max(n, 0);
	};
	Game_Enemy.prototype.srpgMove = function() {
		var n = _defaultMove;
		if (this.enemy().meta.srpgMove) {
			n = Number(this.enemy().meta.srpgMove);
		}
		n += this.tagValue("srpgMovePlus");
		return Math.max(n, 0);
	};

})();