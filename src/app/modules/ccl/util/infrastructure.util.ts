import { Infrastructure } from '../model/infrastructure/infrastructure';
import { ModeleInfra } from '../model/modele-infra/modele-infra';
import { CategorieInfra } from '../model/categorie-infra/categorie-infra';

export class InfrastructureUtil {

    static initializeNewItem(): Infrastructure {
        return new Infrastructure();
    }

    static initializeNewModeleInfra(): ModeleInfra {
        const modele = new ModeleInfra();
        modele.catInfra = new CategorieInfra();
        return modele;
    }

    static resetSearchCriteria(): Infrastructure {
        return new Infrastructure();
    }

    static getVisiblePageNumbers(totalPages: number, currentPage: number): number[] {
        if (totalPages <= 0) return [];
        const maxVisible = 5;
        const half = Math.floor(maxVisible / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxVisible - 1);
        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }

    static filterModelesByCategory(modeles: ModeleInfra[], categoryId?: string): ModeleInfra[] {
        if (!categoryId) return [...modeles];
        return modeles.filter(m => m.catInfra?.id === categoryId);
    }

    static updateSelectionMap(selectionMap: { [key: string]: boolean }): string[] {
        return Object.keys(selectionMap).filter(id => selectionMap[id]);
    }

    static getWarningMessageSimilarityFromList(list: Infrastructure[]): string {
        if (!list || list.length === 0) return '';
        const details = list.map(i => `- ${i.nom || '(inconnu)'} (${i.numero || 'N° inconnu'})`).join('\n');
        return `Des infrastructures similaires existent déjà :\n${details}\n\nVoulez-vous quand même créer celle-ci ?`;
    }
}
