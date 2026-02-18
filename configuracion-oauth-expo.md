# Configuración de OAuth para Expo Go

## URI de Redireccionamiento Autorizado

Debes agregar el siguiente URI en tu Google Cloud Console:

```
https://auth.expo.io/@wendisay28/artistas-app-frontend
```

## Pasos para configurar:

1. **Ve a Google Cloud Console**
   - Ingresa a: https://console.cloud.google.com/
   - Selecciona tu proyecto

2. **Navega a Credenciales**
   - Ve a "APIs & Services" → "Credentials"
   - Busca tu cliente OAuth Web existente:
     - Client ID: `503562343837-qrjeo7rs9su7pp1f8cgci9c21ceukn5f.apps.googleusercontent.com`

3. **Edita el cliente OAuth**
   - Haz clic en el cliente para editarlo
   - En "Authorized redirect URIs", haz clic en "ADD URI"
   - Agrega: `https://auth.expo.io/@wendisay28/artistas-app-frontend`
   - Haz clic en "Save"

4. **Espera la propagación**
   - Los cambios pueden tardar hasta 5 minutos en propagarse

## Verificación en tu código

Tu configuración actual es correcta:

```typescript
// En useLogin.ts (líneas 34-47)
const [request, response, promptAsync] = Google.useAuthRequest({
  ...(isExpoGo
    ? { 
        clientId: "503562343837-qrjeo7rs9su7pp1f8cgci9c21ceukn5f.apps.googleusercontent.com",
        redirectUri: "https://auth.expo.io/@wendisay28/artistas-app-frontend"
      }
    : {
        androidClientId: "503562343837-stqbcod5t8ug6ds0u87ah9mek290kpvo.apps.googleusercontent.com",
        iosClientId: "503562343837-8107on1n39ir43pq43ha301ui2hcsod3.apps.googleusercontent.com",
        webClientId: "503562343837-qrjeo7rs9su7pp1f8cgci9c21ceukn5f.apps.googleusercontent.com",
      }),
  redirectUri: isExpoGo ? undefined : redirectUri,
});
```

## Notas importantes

- **Solo necesitas configurar el cliente OAuth Web** para Expo Go
- **No necesitas clientes Android/iOS** mientras uses Expo Go
- El proxy de Expo (`auth.expo.io`) maneja el redireccionamiento automáticamente
- Para development builds futuros, sí necesitarás los clientes nativos

## Testing

Después de configurar el URI, puedes probar la autenticación:

1. Ejecuta tu app con Expo Go
2. Intenta iniciar sesión con Google
3. Debería redirigir correctamente y volver a tu app

Si tienes problemas, verifica:
- Que el URI esté exactamente como se muestra (sin espacios extra)
- Que estés usando el Client ID correcto
- Que esperes al menos 5 minutos después de guardar los cambios
