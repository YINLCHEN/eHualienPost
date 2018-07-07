import React from 'react'
import {
    Route
} from 'react-router-dom'
import DailyInputApp from './components/DailyInput/App'
import DashboardApp from './components/Dashboard/App'

const router = () => (
    <div>
        <Route exact path="/" component={DailyInput} />
        <Route path="/dailyinput" component={DailyInput} />
        <Route path="/dashboard" component={Dashboard} />
    </div>
)

const DailyInput = () => (
    <DailyInputApp />
)

const Dashboard = () => (
    <DashboardApp />
)

export default router
