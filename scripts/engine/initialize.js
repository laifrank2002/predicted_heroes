var images = {
	//"map1": create_image("assets/map1.png"),
	
}

window.onload = function()
{
	Engine.initialize();
	
	World.generate_map();
	World.new_generation();
	World.map.print("heroes");
}