function Town(settlers)
{
	MapObject.call(this, 1, 1);
	this.type = "town";
	this.movable = false;
	
	// setting up settlers
	settlers.forEach(hero => hero.retire());
	this.resources = 0;
	settlers.forEach(hero => {this.resources += hero.loot / this.LOOT_TO_RESOURCE_RATIO; hero.loot = 0});
	this.fame = 0;
	this.gold = 0;
	settlers.forEach(hero => {this.gold += hero.gold; hero.gold = 0});
	this.population = settlers.length;
	this.residents = settlers;
	
	World.log(`A town has formed! Under the watchful eyes of its leader, ${this.residents[0].name}, it will surely grow and prosper. It currently has a population of ${this.population} people, with a treasury of ${this.gold} gold and a warehouse full of ${this.resources} resources.`);
	World.register_town(this);
}

Town.prototype = Object.create(MapObject.prototype);
Object.defineProperty(Town.prototype, 'constructor', {
	value: Town,
	enumerable: false, // so that it does not appear in 'for in' loop
    writable: true });

Town.prototype.DEFAULT_LOOT_PRICE = 1; // one loot is one gold. pretty fair I guess
Town.prototype.LOOT_TO_RESOURCE_RATIO = 1;

// exchanges loot for gold
Town.prototype.buy_loot = function(hero)
{
	var loot = hero.loot;
	var price = this.DEFAULT_LOOT_PRICE;
	
	if(loot * price > this.gold) loot = this.gold / price;
	
	hero.loot -= loot;
	hero.gold *= loot * price;
	
	this.resources += loot / this.LOOT_TO_RESOURCE_RATIO;
	this.gold -= loot * price;
}

Town.prototype.sell_equipment = function(hero, type)
{
	if(hero.gold >= hero.level)
	{
		if(this.resources > 10)
		{
			var equipment = new Equipment(hero.level, type);
			hero.equipment[type] = equipment;
			hero.gold -= hero.level;
			this.resources -= 10;
		}
	}
}

Town.prototype.retire_hero = function(hero)
{
	Engine.log("Eyy, another one bites the dust in the nursing home!");
	hero.retire();
	this.gold += hero.gold;
	hero.gold = 0;
	this.resources += hero.loot / this.LOOT_TO_RESOURCE_RATIO;
	hero.loot = 0;
	this.residents.push(hero);
	this.population++;
}

// each tick produces some miniscule amount of gold 
Town.prototype.tick = function()
{
	this.gold += Math.floor(Math.sqrt(this.population));
	
	// age all its residents.
	this.residents.forEach(resident => resident.tick());
}

Town.prototype.new_era = function()
{
	this.fame += Math.floor(Math.sqrt(this.resources));
}