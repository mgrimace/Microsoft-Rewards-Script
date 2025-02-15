import { loadConfig } from './Load'
import axios from 'axios'

const NOTIFICATION_TYPES = {
    error: { priority: 'max', tags: 'rotating_light' },
    warn: { priority: 'high', tags: 'warning' },
    log: { priority: 'default', tags: 'medal_sports' }
}

export async function Ntfy(message: string, type: keyof typeof NOTIFICATION_TYPES = 'log'): Promise<void> {
    const config = loadConfig().ntfy
    if (!config?.enabled || !config.url || !config.topic) return

    try {
        const { priority, tags } = NOTIFICATION_TYPES[type]
        const headers = {
            Title: 'Microsoft Rewards Script',
            Priority: priority,
            Tags: tags,
            ...(config.authToken && { Authorization: `Bearer ${config.authToken}` })
        }

        const response = await axios.post(`${config.url}/${config.topic}`, message, { headers })
        
        if (response.status === 200) {
            console.log('NTFY notification successfully sent.')
        } else {
            console.error(`NTFY notification failed with status ${response.status}`)
        }
    } catch (error) {
        console.error('Failed to send NTFY notification:', error)
    }
}