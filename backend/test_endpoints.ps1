# Test health endpoint
Write-Host "Testing health endpoint..."
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method GET

# Test user registration
Write-Host "`nTesting user registration..."
$registerPayload = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Body $registerPayload -ContentType "application/json"
    Write-Host "Registration successful!"
    Write-Host "User ID: $($registerResponse.user.id)"
    Write-Host "Token: $($registerResponse.token)"
    
    # Save token for later requests
    $token = $registerResponse.token
}
catch {
    Write-Host "Registration failed: $_"
    # Try login if registration fails (user might already exist)
    Write-Host "`nAttempting login..."
    $loginPayload = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    try {
        $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $loginPayload -ContentType "application/json"
        Write-Host "Login successful!"
        Write-Host "User ID: $($loginResponse.user.id)"
        Write-Host "Token: $($loginResponse.token)"
        
        # Save token for later requests
        $token = $loginResponse.token
    }
    catch {
        Write-Host "Login failed: $_"
        exit
    }
}

# Test get current user
Write-Host "`nTesting get current user..."
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $userResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
    Write-Host "Get user successful!"
    Write-Host "User data: $($userResponse.data | ConvertTo-Json)"
}
catch {
    Write-Host "Get user failed: $_"
}

# Test create address
Write-Host "`nTesting create address..."
$addressPayload = @{
    type = "shipping"
    firstName = "John"
    lastName = "Doe"
    address = "123 Main St"
    city = "New York"
    state = "NY"
    zipCode = "10001"
    country = "USA"
    phone = "1234567890"
    isDefault = $true
} | ConvertTo-Json

try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $addressResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/users/addresses" -Method POST -Body $addressPayload -ContentType "application/json" -Headers $headers
    Write-Host "Create address successful!"
    Write-Host "Address ID: $($addressResponse.data.id)"
    
    # Save address ID for later requests
    $addressId = $addressResponse.data.id
}
catch {
    Write-Host "Create address failed: $_"
}

# Test get addresses
Write-Host "`nTesting get addresses..."
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $addressesResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/users/addresses" -Method GET -Headers $headers
    Write-Host "Get addresses successful!"
    Write-Host "Addresses: $($addressesResponse.data | ConvertTo-Json)"
}
catch {
    Write-Host "Get addresses failed: $_"
}

Write-Host "`nAll tests completed!" 