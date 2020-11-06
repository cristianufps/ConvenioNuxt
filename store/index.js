export const state = () => ({
    counter: 0,
    drawerApp: false,
    stateAlert: 0
})

export const mutations = {
    setDrawer(state, valor) {
        state.drawerApp = valor
    },
    setAlerts(state, valor) {
        state.stateAlert = valor
    }
}