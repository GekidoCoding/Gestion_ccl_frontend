export class ComponentUtil {
    public getClientName(client: any): string {
        return client.nom && client.prenom ? `${client.nom} ${client.prenom}` : client.raisonSociale || 'N/A';
    }
}