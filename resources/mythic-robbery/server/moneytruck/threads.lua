Citizen.CreateThread(function()
	while Fetch == nil do
		Citizen.Wait(10)
	end

	local spawned = false
	while true do
		spawned = false

        if #_moneyTruckSpawns == 0 then
            _moneyTruckSpawns = table.copy(_spawnHoldingShit)
        end

        if _truckSpawnEnabled then
            spawned = SpawnBobcatTruck(math.random(100) > 50 and `stockade2` or `stockade`)
            if not spawned then
                Citizen.Wait(30000)
            else
                Citizen.Wait(BCT_SPAWN_RATE)
            end
        else
            Citizen.Wait(60000)
        end
	end
end)