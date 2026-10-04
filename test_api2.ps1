$body = '{"player_id": "535123457"}'
Invoke-RestMethod -Uri http://localhost:3001/api/player/lookup -Method Post -ContentType 'application/json' -Body $body