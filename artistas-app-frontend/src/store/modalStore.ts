import { create } from 'zustand';

interface ModalState {
  // Estados de modales existentes
  bioModal: { 
    visible: boolean; 
    initialValue: string;
  };
  
  experienceModal: { 
    visible: boolean; 
    data: any;
  };
  
  editServiceModal: { 
    visible: boolean; 
    service: any;
  };
  
  socialLinksModal: { 
    visible: boolean; 
    data: any;
  };
  
  studiesModal: { 
    visible: boolean; 
    data: any;
  };
  
  categoryModal: { 
    visible: boolean; 
    data: any;
  };
  
  infoProfesionalModal: { 
    visible: boolean; 
    data: any;
  };
  
  // Actions
  openBioModal: (initialValue: string) => void;
  closeBioModal: () => void;
  
  openExperienceModal: (data: any) => void;
  closeExperienceModal: () => void;
  
  openEditServiceModal: (service: any) => void;
  closeEditServiceModal: () => void;
  
  openSocialLinksModal: (data: any) => void;
  closeSocialLinksModal: () => void;
  
  openStudiesModal: (data: any) => void;
  closeStudiesModal: () => void;
  
  openCategoryModal: (data: any) => void;
  closeCategoryModal: () => void;
  
  openInfoProfesionalModal: (data: any) => void;
  closeInfoProfesionalModal: () => void;
  
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Estados iniciales
  bioModal: { visible: false, initialValue: '' },
  experienceModal: { visible: false, data: null },
  editServiceModal: { visible: false, service: null },
  socialLinksModal: { visible: false, data: null },
  studiesModal: { visible: false, data: null },
  categoryModal: { visible: false, data: null },
  infoProfesionalModal: { visible: false, data: null },
  
  // Actions
  openBioModal: (initialValue) => set((state) => ({
    bioModal: { visible: true, initialValue }
  })),
  
  closeBioModal: () => set((state) => ({
    bioModal: { visible: false, initialValue: '' }
  })),
  
  openExperienceModal: (data) => set((state) => ({
    experienceModal: { visible: true, data }
  })),
  
  closeExperienceModal: () => set((state) => ({
    experienceModal: { visible: false, data: null }
  })),
  
  openEditServiceModal: (service) => set((state) => ({
    editServiceModal: { visible: true, service }
  })),
  
  closeEditServiceModal: () => set((state) => ({
    editServiceModal: { visible: false, service: null }
  })),
  
  openSocialLinksModal: (data) => set((state) => ({
    socialLinksModal: { visible: true, data }
  })),
  
  closeSocialLinksModal: () => set((state) => ({
    socialLinksModal: { visible: false, data: null }
  })),
  
  openStudiesModal: (data) => set((state) => ({
    studiesModal: { visible: true, data }
  })),
  
  closeStudiesModal: () => set((state) => ({
    studiesModal: { visible: false, data: null }
  })),
  
  openCategoryModal: (data) => set((state) => ({
    categoryModal: { visible: true, data }
  })),
  
  closeCategoryModal: () => set((state) => ({
    categoryModal: { visible: false, data: null }
  })),
  
  openInfoProfesionalModal: (data) => set((state) => ({
    infoProfesionalModal: { visible: true, data }
  })),
  
  closeInfoProfesionalModal: () => set((state) => ({
    infoProfesionalModal: { visible: false, data: null }
  })),
  
  closeAllModals: () => set({
    bioModal: { visible: false, initialValue: '' },
    experienceModal: { visible: false, data: null },
    editServiceModal: { visible: false, service: null },
    socialLinksModal: { visible: false, data: null },
    studiesModal: { visible: false, data: null },
    categoryModal: { visible: false, data: null },
    infoProfesionalModal: { visible: false, data: null },
  }),
}));
