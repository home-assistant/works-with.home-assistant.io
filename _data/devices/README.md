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
      "protocol": "Zigbee|Z-Wave|WiFi|Thread|Matter over Thread|Matter over WiFi|ESPHome|Bluetooth|PoE",
      "websiteLink": "https://example.com/product-page",
      "deviceType": "Sensor|Switch|Plug|Light|Cover|Lock|Climate|etc.",
      "secondaryDeviceType": "Motion|Temperature|Window|etc.",
      "relatedProducts": {"text": "Required Hub Name", "url": "https://example.com/hub"},
      "region": ["Worldwide"],
      "functionalityRemark": "Optional notes about protocol limitations"
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
  - **protocol**: Communication protocol (Zigbee, Z-Wave, WiFi, Thread, Matter over Thread, Matter over WiFi, ESPHome, Bluetooth, PoE)
  - **websiteLink**: URL to the product page
  - **deviceType**: Primary category of device (Sensor, Switch, Plug, Light, Cover, Lock, Climate, Camera, Hub, etc.)
  - **secondaryDeviceType**: More specific device type or capabilities (Motion, Temperature, Window, Leak, Air quality, etc.)
  - **relatedProducts**: Required related products (e.g., hubs, bridges). Can be an object with `text` and `url` properties, or an empty string if not applicable
  - **region**: Array of geographic regions where the device is available (e.g., `["Worldwide"]`, `["USA", "Europe"]`, `["UK"]`)
  - **functionalityRemark**: Notes about protocol limitations or functionality constraints

## Adding New Devices

1. Create a new JSON file named after the brand (lowercase)
2. Follow the structure above
3. Ensure all required fields are filled
4. Use empty strings ("") for optional fields if not applicable
5. The devices will automatically appear in the devices table at `/devices/`
