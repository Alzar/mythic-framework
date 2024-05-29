_MDT.BusinessReceipts = {
	Search = function(self, jobId, term)
        if not term then term = '' end
		local p = promise.new()

        local aggregation = {}

        table.insert(aggregation, {
            ['$match'] = {
                ['$or'] = {
                    {
                        customerName = { ['$regex'] = term, ['$options'] = 'i' }
                    },
					{
                        ["$expr"] = {
                            ["$regexMatch"] = {
                                input = {
									["$concat"] = { 
										"$author.First", 
										" ", 
										"$author.Last", 
										" ", 
										{ ['$toString'] = "$author.SID" }
									}
                                },
                                regex = term,
                                options = "i",
                            },
                        },
                    },
                },
				job = jobId,
            },
        })

		Database.Game:aggregate({
            collection = "business_receipts",
            aggregate = aggregation,
        }, function(success, results)
            if not success then
				p:resolve(false)
                return
            end
			p:resolve(results)
        end)
		return Citizen.Await(p)
	end,
	View = function(self, jobId, id)
		local p = promise.new()
        Database.Game:findOne({
            collection = "business_receipts",
            query = {
                job = jobId,
                _id = id,
            },
        }, function(success, report)
			if not report then
				p:resolve(false)
				return
			end
			p:resolve(report[1])
        end)
		return Citizen.Await(p)
	end,
	Create = function(self, jobId, data)
		if not _businessTablets[jobId] then
			return false
		end

		local p = promise.new()
        data.job = jobId
		Database.Game:insertOne({
			collection = "business_receipts",
			document = data,
		}, function(success, result, insertId)
			if not success then
				p:resolve(false)
				return
			end
			p:resolve({
				_id = insertId[1],
			})
		end)

		return Citizen.Await(p)
	end,
	Update = function(self, jobId, id, char, report)
		local p = promise.new()
		Database.Game:updateOne({
			collection = "business_receipts",
			query = {
				_id = id,
                job = jobId,
			},
			update = {
				["$set"] = report,
				["$push"] = {
					history = {
						Time = (os.time() * 1000),
						Char = char:GetData("SID"),
						Log = string.format(
								"%s Updated Report",
								char:GetData("First") .. " " .. char:GetData("Last")
						),
					},
				},
			},
		}, function(success, result)
			p:resolve(success)
		end)
		return Citizen.Await(p)
	end,
    Delete = function(self, jobId, id)
        local p = promise.new()

        Database.Game:deleteOne({
			collection = "business_receipts",
			query = {
				_id = id,
                job = jobId,
			},
		}, function(success, deleted)
			p:resolve(success)
		end)
		return Citizen.Await(p)
    end,
	DeleteAll = function(self, jobId)
		if not jobId then return false; end

		local p = promise.new()

        Database.Game:delete({
			collection = "business_receipts",
			query = {
                job = jobId,
			},
		}, function(success, deleted)
			p:resolve(success)
		end)
		return Citizen.Await(p)
	end,
}

AddEventHandler("MDT:Server:RegisterCallbacks", function()
    Callbacks:RegisterServerCallback("MDT:Business:Receipt:Search", function(source, data, cb)
        local job = CheckBusinessPermissions(source)
		if job then
			cb(MDT.BusinessReceipts:Search(job, data.term))
		else
			cb(false)
		end
    end)

    Callbacks:RegisterServerCallback("MDT:Business:Receipt:Create", function(source, data, cb)
        local char = Fetch:Source(source):GetData("Character")
        local job = CheckBusinessPermissions(source, 'TABLET_CREATE_RECEIPT')
		if job then
			data.doc.author = {
				SID = char:GetData("SID"),
				First = char:GetData("First"),
				Last = char:GetData("Last"),
			}
			cb(MDT.BusinessReceipts:Create(job, data.doc))
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback("MDT:Business:Receipt:Update", function(source, data, cb)
        local char = Fetch:Source(source):GetData('Character')
        local job = CheckBusinessPermissions(source, 'TABLET_MANAGE_RECEIPT')
		if char and job then
            data.Report.lastUpdated = {
                Time = (os.time() * 1000),
                SID = char:GetData("SID"),
                First = char:GetData("First"),
                Last = char:GetData("Last"),
            }
			cb(MDT.BusinessReceipts:Update(job, data.id, char, data.Report))
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback("MDT:Business:Receipt:Delete", function(source, data, cb)
        local job = CheckBusinessPermissions(source, 'TABLET_MANAGE_RECEIPT')
		if job then
			cb(MDT.BusinessReceipts:Delete(job, data.id))
        else
            cb(false)
        end
    end)

	Callbacks:RegisterServerCallback("MDT:Business:Receipt:DeleteAll", function(source, data, cb)
        local job = CheckBusinessPermissions(source, 'TABLET_CLEAR_RECEIPT')
		if job then
			cb(MDT.BusinessReceipts:DeleteAll(job))
        else
            cb(false)
        end
    end)

    Callbacks:RegisterServerCallback("MDT:Business:Receipt:View", function(source, data, cb)
        local job = CheckBusinessPermissions(source)
		if job then
			cb(MDT.BusinessReceipts:View(job, data))
        else
			cb(false)
		end
    end)
end)
