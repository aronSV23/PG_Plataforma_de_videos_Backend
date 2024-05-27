import app from './app.js'
import { PORT } from './config/config.js'

app.listen(PORT, () => console.log(`
Server running on http://localhost:${PORT}
Docs running on http://localhost:${PORT}/doc
`))
