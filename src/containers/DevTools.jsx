/**
 * redux-devtools for better troubleshooting
 * learn more on how to use this baby to time travel here https://github.com/gaearon/redux-devtools
 */

import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'

export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-w">
    <LogMonitor />
  </DockMonitor>
)
