local _threading = false
function StartBobcatThreads()
    if _threading then return end
    _threading = true

    Citizen.CreateThread(function()
        while _threading do
            if _bcGlobalReset ~= nil and os.time() > _bcGlobalReset then
                Logger:Info("Robbery", "Bobcat Heist Has Been Reset")
                ResetBobcat()
            end
            Citizen.Wait(30000)
        end
    end)
end