local spikeModel = `P_ld_stinger_s`

local _911Handler = nil
local _311Handler = nil

AddEventHandler("Police:Client:OnDuty", function()
	if not LocalPlayer.state.Character:GetData("Callsign") then
		Notification:Error("Callsign Not Set, Unable To Go On Duty")
		return
	end

	StatSetInt(`MP0_STAMINA`, 35, true)
	Jobs.Duty:On("police")
end)

AddEventHandler("Police:Client:OffDuty", function()
	StatSetInt(`MP0_STAMINA`, 25, true)
	Jobs.Duty:Off("police")
end)

AddEventHandler("Corrections:Client:OnDuty", function()
	Jobs.Duty:On("prison")
end)

AddEventHandler("Corrections:Client:OffDuty", function()
	Jobs.Duty:Off("prison")
end)

RegisterNetEvent("Police:Client:Search", function(hitting, data)
	Inventory.Search:Character(hitting.serverId)
	while not LocalPlayer.state.inventoryOpen do
		Citizen.Wait(1)
	end

	Citizen.CreateThread(function()
		while LocalPlayer.state.inventoryOpen do
			if #(GetEntityCoords(LocalPlayer.state.ped) - GetEntityCoords(GetPlayerPed(GetPlayerFromServerId(hitting.serverId)))) > 3.0 then
				Inventory.Close:All()
			end
			Citizen.Wait(2)
		end
	end)
end)

RegisterNetEvent("Police:Client:RunPlate", function(hitting, data)
	local veh = hitting.entity
	local vehEnt = Entity(veh)

	local plate = GetVehicleNumberPlateText(veh)
	if vehEnt.state.RegisteredPlate and not vehEnt.state.FakePlate then
		plate = vehEnt.state.RegisteredPlate
	end

	TriggerServerEvent(
		"Police:Server:RunPlate",
		plate,
		vehEnt.state.VIN,
		string.format("%s", GetLabelText(GetDisplayNameFromVehicleModel(GetEntityModel(vehEnt))))
	)
end)

AddEventHandler("Police:Client:GSR", function(entity, data)
	Progress:Progress({
		name = "gsr_action",
		duration = 6000,
		label = "Performing GSR Test",
		useWhileDead = false,
		canCancel = true,
		ignoreModifier = true,
		controlDisables = {
			disableMovement = true,
			disableCarMovement = true,
			disableMouse = false,
			disableCombat = true,
		},
		animation = {
			task = "WORLD_HUMAN_STAND_MOBILE",
		},
	}, function(cancelled)
		if not cancelled then
			Callbacks:ServerCallback("Police:GSRTest", entity.serverId, function() end)
		end
	end)
end)

AddEventHandler("Police:Client:BAC", function(entity, data)
	Progress:Progress({
		name = "bac_action",
		duration = 6000,
		label = "Performing Blood Alcohol Test",
		useWhileDead = false,
		canCancel = true,
		ignoreModifier = true,
		controlDisables = {
			disableMovement = true,
			disableCarMovement = true,
			disableMouse = false,
			disableCombat = true,
		},
		animation = {
			task = "WORLD_HUMAN_STAND_MOBILE",
		},
	}, function(cancelled)
		if not cancelled then
			Callbacks:ServerCallback("Police:BACTest", entity.serverId, function() end)
		end
	end)
end)

AddEventHandler("Police:Client:DNASwab", function(entity, data)
	Progress:Progress({
		name = "dna_action",
		duration = 6000,
		label = "Performing DNA Swab",
		useWhileDead = false,
		canCancel = true,
		ignoreModifier = true,
		controlDisables = {
			disableMovement = true,
			disableCarMovement = true,
			disableMouse = false,
			disableCombat = true,
		},
		animation = {
			task = "WORLD_HUMAN_STAND_MOBILE",
		},
	}, function(cancelled)
		if not cancelled then
			Callbacks:ServerCallback("Police:DNASwab", entity.serverId, function() end)
		end
	end)
end)

-- laying out objects

local spikeTime = 16000
local spikesOut = false
local forceDelete = {}

AddEventHandler("Keybinds:Client:KeyDown:cancel_action", function()
	if spikesOut then
		Citizen.SetTimeout(300, function()
			TriggerServerEvent("Police:Server:RemoveSpikes")
		end)
	end
end)

RegisterNetEvent("Police:Client:AddDeployedSpike", function(positions, h, owner)
	if #(GetEntityCoords(LocalPlayer.state.ped) - positions[1]) <= 800.0 then
		local start = GetGameTimer()
		local timeout = false
		Citizen.SetTimeout(spikeTime - 2000, function() timeout = true; end)

		spikesOut = owner == GetPlayerServerId(LocalPlayer.state.PlayerID)

		while #(GetEntityCoords(LocalPlayer.state.ped) - positions[1]) > 75.0 and not timeout and not forceDelete[owner] do
			Citizen.Wait(10)
		end

		if not timeout and not forceDelete[owner] then
			loadModel(spikeModel)
			for k, v in ipairs(positions) do
				local spikeObj = CreateObject(spikeModel, v.x, v.y, v.z, 0, 1, 1) -- x+1
				TriggerEvent("Police:Client:SpikeyBois", v.x, v.y, v.z, spikeObj, (spikeTime - (GetGameTimer() - start)) / 10, owner)
				PlaceObjectOnGroundProperly(spikeObj)
				SetEntityHeading(spikeObj, h)
				FreezeEntityPosition(spikeObj, true)
			end
		end
	end
end)

RegisterNetEvent("Police:Client:RemoveSpikes", function(owner)
	forceDelete[owner] = true
	Citizen.SetTimeout(500, function()
		forceDelete[owner] = false
	end)
end)

-- watching each object then deleting after 5s
AddEventHandler("Police:Client:SpikeyBois", function(x, y, z, obj, cunts, owner)
	local pos = vector3(x, y, z)
	local timer = 0
	while timer < cunts and not forceDelete[owner] do
		local veh = GetVehiclePedIsIn(LocalPlayer.state.ped)
		if veh ~= 0 and LocalPlayer.state.loggedIn then
			local driver = GetPedInVehicleSeat(veh, -1)
			if driver then
				local spikeObj = GetClosestObjectOfType(x, y, z, 5.0, spikeModel, false, false, false)
				local min, max = GetModelDimensions(GetEntityModel(veh))
				if GetTyreHealth(veh, 0) > 0 then
					local lf = GetOffsetFromEntityInWorldCoords(veh, min.x + 0.25, (max.y * 0.7), -0.95)
					--DrawMarker(1, lf.x, lf.y, lf.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1.0, 255, 0, 0, 250, false, false, 2, false, false, false, false)
					local lft = IsVehicleTyreBurst(veh, 0, true)
					if not lft and #(pos - lf) < 2.0 then
						if IsEntityTouchingEntity(veh, spikeObj) then
							SetVehicleTyreBurst(veh, 0, true, 1000.0)
						end
					end
				end

				if GetTyreHealth(veh, 1) > 0 then
					local rf = GetOffsetFromEntityInWorldCoords(veh, max.x - 0.25, (max.y * 0.7), -0.95)
					--DrawMarker(1, rf.x, rf.y, rf.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1.0, 0, 255, 0, 250, false, false, 2, false, false, false, false)
					local rft = IsVehicleTyreBurst(veh, 1, true)
					if not rft and #(pos - rf) < 2.0 then
						if IsEntityTouchingEntity(veh, spikeObj) then
							SetVehicleTyreBurst(veh, 1, true, 1000.0)
						end
					end
				end

				if GetTyreHealth(veh, 2) > 0 then
					local lm = GetOffsetFromEntityInWorldCoords(veh, min.x + 0.25, (min.y * 0.55), -0.95)
					--DrawMarker(1, lm.x, lm.y, lm.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1.0, 0, 255, 255, 250, false, false, 2, false, false, false, false)
					local lmt = IsVehicleTyreBurst(veh, 2, true)
					if not lmt and #(pos - lm) < 2.0 then
						if IsEntityTouchingEntity(veh, spikeObj) then
							SetVehicleTyreBurst(veh, 2, true, 1000.0)
						end
					end
				end

				if GetTyreHealth(veh, 3) > 0 then
					local rm = GetOffsetFromEntityInWorldCoords(veh, max.x - 0.25, (min.y * 0.55), -0.95)
					--DrawMarker(1, rm.x, rm.y, rm.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1.0, 255, 0, 255, 250, false, false, 2, false, false, false, false)
					local rmt = IsVehicleTyreBurst(veh, 3, true)
					if not rmt and #(pos - rm) < 2.0 then
						if IsEntityTouchingEntity(veh, spikeObj) then
							SetVehicleTyreBurst(veh, 3, true, 1000.0)
						end
					end
				end

				if GetTyreHealth(veh, 4) > 0 then
					local lr = GetOffsetFromEntityInWorldCoords(veh, min.x + 0.25, (min.y * 0.7), -0.95)
					--DrawMarker(1, lr.x, lr.y, lr.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1.0, 0, 0, 255, 250, false, false, 2, false, false, false, false)
					local lrt = IsVehicleTyreBurst(veh, 4, true)
					if not lrt and #(pos - lr) < 2.0 then
						if IsEntityTouchingEntity(veh, spikeObj) then
							SetVehicleTyreBurst(veh, 4, true, 1000.0)
						end
					end
				end

				if GetTyreHealth(veh, 5) > 0 then
					local rr = GetOffsetFromEntityInWorldCoords(veh, max.x - 0.25, (min.y * 0.7), -0.95)
					--DrawMarker(1, rr.x, rr.y, rr.z, 0, 0, 0, 0, 0, 0, 0.5, 0.5, 1.0, 255, 255, 0, 250, false, false, 2, false, false, false, false)
					local rrt = IsVehicleTyreBurst(veh, 5, true)
					if not rrt and #(pos - rr) < 2.0 then
						if IsEntityTouchingEntity(veh, spikeObj) then
							SetVehicleTyreBurst(veh, 5, true, 1000.0)
						end
					end
				end
			end
		end
		timer = timer + 1
		Citizen.Wait(1)
	end

	DeleteEntity(obj)
end)

AddEventHandler("Police:Client:OpenLocker", function()
	Callbacks:ServerCallback("MDT:OpenPersonalLocker", {}, function(success)
		if not success then
			Notification:Error("Callsign Not Set, Unable To Open Locker")
		end
	end)
end)

AddEventHandler("Polyzone:Enter", function(id, testedPoint, insideZones, data)
	if data.pdstation then
		LocalPlayer.state.inPdStation = true
	end
end)

AddEventHandler("Polyzone:Exit", function(id, testedPoint, insideZones, data)
	if data.pdstation then
		LocalPlayer.state.inPdStation = false
	end
end)

AddEventHandler('Police:Client:RemoveMask', function(entity, data)
	Callbacks:ServerCallback("Police:RemoveMask", entity.serverId)
end)