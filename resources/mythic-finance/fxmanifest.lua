fx_version "cerulean"
game 'gta5'
lua54 'yes'
client_script "@mythic-base/components/cl_error.lua"
client_script "@mythic-pwnzor/client/check.lua"

client_scripts {
	"shared/**/*.lua",
	"client/**/*.lua",
}

server_scripts {
	"shared/**/*.lua",
	"server/**/*.lua",
}

ui_page 'ui/dist/index.html'

files {"ui/dist/index.html", 'ui/dist/*.js', 'ui/dist/*.png', 'ui/dist/*.webp'}