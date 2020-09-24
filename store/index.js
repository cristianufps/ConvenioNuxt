export const state = () => ({
    counter: 0,
    drawerApp: false
})

export const mutations = {
    setDrawer(state, valor) {
        state.drawerApp = valor
    }
}