# Input Controllers

## 'Keyboard' Input Controller

### Mappings for every aircraft type

| Key Pressed     | Console Output                         | Action Type                          | Value |
|-----------------|----------------------------------------|--------------------------------------|-------|
| ↑ Up Arrow      | Moving Forward                         | `ActuatorActionTypes.MoveForward`    | 1.0   |
| ↓ Down Arrow    | Moving Backward                        | `ActuatorActionTypes.MoveBackward`   | 1.0   |
| ← Left Arrow    | Turning Left                           | `ActuatorActionTypes.TurnLeft`       | 1.0   |
| → Right Arrow   | Turning Right                          | `ActuatorActionTypes.TurnRight`      | 1.0   |
| Page Up         | Moving Up                              | `ActuatorActionTypes.MoveUp`         | 1.0   |
| Page Down       | Moving Down                            | `ActuatorActionTypes.MoveDown`       | 1.0   |
| A               | Opening Autopilot                      | `ActuatorActionTypes.OpenAutopilot`  | 1.0   |
| B               | Closing Autopilot                      | `ActuatorActionTypes.CloseAutopilot` | 1.0   |
| (any other key) | Key {key} pressed. No action assigned. | `ActuatorActionTypes.None`           | 0.0   |


## 'Logitech Extreme 3D Pro' Joystick Input Controller

### Mappings when aircraft type is `Drone`

| Joystick Movement / Button Pressed       | Console Output       | Action Type                          | Value                   |
|-------------------------------------------|----------------------|---------------------------------------|--------------------------|
| Pitch Forward (Joystick Forward)         | Moving Backward      | `ActuatorActionTypes.MoveBackward`   | 0.0 - 10.0 (normalized) |
| Pitch Backward (Joystick Backward)       | Moving Forward       | `ActuatorActionTypes.MoveForward`    | 0.0 - 10.0 (normalized) |
| Roll Left (Joystick Left)                | Turning Left         | `ActuatorActionTypes.TurnLeft`       | 0.0 - 2.0 (normalized)  |
| Roll Right (Joystick Right)              | Turning Right        | `ActuatorActionTypes.TurnRight`      | 0.0 - 2.0 (normalized)  |
| Button 3 (Assumed for Moving Up)         | Moving Up            | `ActuatorActionTypes.MoveUp`         | 0.0 - 10.0 (normalized) |
| Button 4 (Assumed for Moving Down)       | Moving Down          | `ActuatorActionTypes.MoveDown`       | 0.0 - 10.0 (normalized) |
| Button 5 (Assumed for Opening Autopilot) | Opening Autopilot    | `ActuatorActionTypes.OpenAutopilot`  | 1.0                     |
| Button 6 (Assumed for Closing Autopilot) | Closing Autopilot    | `ActuatorActionTypes.CloseAutopilot` | 1.0                     |
| (any other button or movement)           | No action assigned.  | `ActuatorActionTypes.None`           | 0.0                     |


### Mappings when aircraft type is `Plane`

**NOT IMPLEMENTED YET**
