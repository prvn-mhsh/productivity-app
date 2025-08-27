'use server';

import { suggestSpendingCategories } from '@/ai/flows/suggest-spending-categories';
import { CATEGORIES } from '@/lib/constants';

export async function suggestCategoryAction(description: string): Promise<string | null> {
  if (!description) {
    return null;
  }
  try {
    const result = await suggestSpendingCategories({ transactionDescription: description });
    
    const suggestedCategoryName = result.suggestedCategory.toLowerCase();

    // Find a category that is either included in the suggestion or includes the suggestion
    const foundCategory = CATEGORIES.find(cat => 
        suggestedCategoryName.includes(cat.name.toLowerCase().split(' ')[0]) || 
        cat.name.toLowerCase().includes(suggestedCategoryName.split(' ')[0])
    );

    if (foundCategory && result.confidence > 0.5) {
      return foundCategory.id;
    }

    return null;
  } catch (error){
    console.error('Error suggesting category:', error);
    // In a production app, you might want to log this to a service
    return null;
  }
}
