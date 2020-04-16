import Dexie from 'dexie'

const db = new Dexie('you-can-quit')
db.version(1).stores({
    days: `&name, status`
})

export default db
