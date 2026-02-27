@echo off
echo 🔧 Configurando Daniela IA en español...

powershell -Command ^
"$sid = 'REDACTED_TWILIO_SID'; ^
$token = 'REDACTED_TWILIO_TOKEN'; ^
$phone = '+16183581369'; ^
$auth = 'Basic ' + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes(\"$sid`:$token\")); ^
$headers = @{'Authorization' = $auth; 'Content-Type' = 'application/json'}; ^
$twiml = '<?xml version=\"1.0\" encoding=\"UTF-8\"?><Response><Say language=\"es-ES\" voice=\"Polly.Lucia-Neural\">¡Hola! Soy Daniela IA de AIGestion. Conectando con Alejandro...</Say><Pause length=\"1\"/><Dial>+34618779308</Dial></Response>'; ^
$body = @{'FriendlyName' = 'Daniela IA Spanish'; 'TwiML' = $twiml} | ConvertTo-Json; ^
try { ^
    $response = Invoke-RestMethod -Uri \"https://api.twilio.com/2010-04-01/Accounts/$sid/TwiMLBins.json\" -Method Post -Headers $headers -Body $body; ^
    Write-Host '✅ TwiML Bin creado:' $response.url; ^
    $updateBody = @{'VoiceUrl' = $response.url; 'VoiceMethod' = 'GET'}; ^
    $update = Invoke-RestMethod -Uri \"https://api.twilio.com/2010-04-01/Accounts/$sid/IncomingPhoneNumbers/$phone.json\" -Method Post -Headers $headers -Body $updateBody; ^
    Write-Host '✅ Número actualizado'; ^
    $callBody = @{'From' = $phone; 'To' = '+34618779308'; 'Url' = $response.url; 'Method' = 'GET'}; ^
    $call = Invoke-RestMethod -Uri \"https://api.twilio.com/2010-04-01/Accounts/$sid/Calls.json\" -Method Post -Headers $headers -Body $callBody; ^
    Write-Host '✅ Llamada iniciada:' $call.sid; ^
    Write-Host '🤖 Daniela IA ahora habla español'; ^
} catch { ^
    Write-Host '❌ Error:' $_.Exception.Message; ^
}"

echo.
echo 🎉 Si todo funcionó, llama a +1 618 358 1369
echo 🤖 Daniela IA debería hablar en español ahora
pause
