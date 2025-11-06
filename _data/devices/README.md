# Devices Data Structure

This directory contains JSON files for each manufacturer's certified devices.

## File Naming Convention

Each manufacturer should have their own JSON file named after the brand (lowercase):
- `frient.json`
- `aqara.json`
- etc.

## JSON Structure

Each file should follow this structure:

```json
{
  "companyName": "Company Legal Name",
  "brand": "brand-name",
  "devices": [
    {
      "deviceName": "Device Short Name",
      "fullName": "Brand Device Full Name",
      "modelNumber": "MODEL-123",
      "protocol": "Zigbee|Z-Wave|Wi-Fi|Thread|Matter",
      "websiteLink": "https://example.com/product-page",
      "priority": "",
      "deviceType": "Motion Sensor|Switch|Plug|etc.",
      "specialistEquipment": "Optional notes",
      "region": "US|EU|UK|etc.",
      "functionalityRemark": "Optional notes about protocol limitations",
      "comments": "Optional comments"
    }
  ]
}
```

## Field Descriptions

- **companyName**: The legal company name (e.g., "Onics")
- **brand**: The brand name used for filtering (e.g., "frient")
- **devices**: Array of device objects
  - **deviceName**: Short device name for display
  - **fullName**: Complete device name including brand
  - **modelNumber**: Manufacturer's model number
  - **protocol**: Communication protocol (Zigbee, Z-Wave, Wi-Fi, Thread, Matter)
  - **websiteLink**: URL to the product page
  - **priority**: Optional priority level
  - **deviceType**: Category of device (Motion Sensor, Switch, Plug, etc.)
  - **specialistEquipment**: Any special equipment requirements
  - **region**: Geographic region if region-specific
  - **functionalityRemark**: Notes about protocol limitations or functionality constraints
  - **comments**: Additional notes or comments

## Adding New Devices

1. Create a new JSON file named after the brand (lowercase)
2. Follow the structure above
3. Ensure all required fields are filled
4. Use empty strings ("") for optional fields if not applicable
5. The devices will automatically appear in the devices table at `/devices/`
