export default function ({ $axios, redirect , app }) {
    $axios.onError(error => {
        if (error.response.status === 401) {
           return app.$auth.logout();
        }
    })
}