export const state = () => ({
    counter: 0,
    globalVariable: 'penerson'
})

export const mutations = {
    cambiarVariable(state, valor) {
        // mutate state
        state.globalVariable = valor
    }
}