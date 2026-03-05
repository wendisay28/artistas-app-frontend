import { create } from 'zustand';

interface ModalState {
  // Estados de modales existentes
  acercaDeMiModal: { 
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
  
  editHeaderModal: { 
    visible: boolean; 
    artist: any;
  };
  
  editProductModal: { 
    visible: boolean; 
    product: any;
  };
  
  editEventModal: { 
    visible: boolean; 
    event: any;
  };
  
  companyModal: { 
    visible: boolean; 
    artist: any;
  };
  
  videoModal: { 
    visible: boolean; 
    video: any;
  };
  
  // Actions
  openAcercaDeMiModal: (initialValue: string) => void;
  closeAcercaDeMiModal: () => void;
  
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
  
  openEditHeaderModal: (artist: any) => void;
  closeEditHeaderModal: () => void;
  
  openEditProductModal: (product: any) => void;
  closeEditProductModal: () => void;
  
  openEditEventModal: (event: any) => void;
  closeEditEventModal: () => void;
  
  openCompanyModal: (artist: any) => void;
  closeCompanyModal: () => void;
  
  openVideoModal: (video: any) => void;
  closeVideoModal: () => void;
  
  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Estados iniciales
  acercaDeMiModal: { visible: false, initialValue: '' },
  experienceModal: { visible: false, data: null },
  editServiceModal: { visible: false, service: null },
  socialLinksModal: { visible: false, data: null },
  studiesModal: { visible: false, data: null },
  categoryModal: { visible: false, data: null },
  infoProfesionalModal: { visible: false, data: null },
  editHeaderModal: { visible: false, artist: null },
  editProductModal: { visible: false, product: null },
  editEventModal: { visible: false, event: null },
  companyModal: { visible: false, artist: null },
  videoModal: { visible: false, video: null },
  
  // Actions
  openAcercaDeMiModal: (initialValue) => set((state) => ({
    acercaDeMiModal: { visible: true, initialValue }
  })),
  
  closeAcercaDeMiModal: () => set((state) => ({
    acercaDeMiModal: { visible: false, initialValue: '' }
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
  
  openEditHeaderModal: (artist) => set((state) => ({
    editHeaderModal: { visible: true, artist }
  })),
  
  closeEditHeaderModal: () => set((state) => ({
    editHeaderModal: { visible: false, artist: null }
  })),
  
  openEditProductModal: (product) => set((state) => ({
    editProductModal: { visible: true, product }
  })),
  
  closeEditProductModal: () => set((state) => ({
    editProductModal: { visible: false, product: null }
  })),
  
  openEditEventModal: (event) => set((state) => ({
    editEventModal: { visible: true, event }
  })),
  
  closeEditEventModal: () => set((state) => ({
    editEventModal: { visible: false, event: null }
  })),
  
  openCompanyModal: (artist) => set((state) => ({
    companyModal: { visible: true, artist }
  })),
  
  closeCompanyModal: () => set((state) => ({
    companyModal: { visible: false, artist: null }
  })),
  
  openVideoModal: (video) => set((state) => ({
    videoModal: { visible: true, video }
  })),
  
  closeVideoModal: () => set((state) => ({
    videoModal: { visible: false, video: null }
  })),
  
  closeAllModals: () => set({
    acercaDeMiModal: { visible: false, initialValue: '' },
    experienceModal: { visible: false, data: null },
    editServiceModal: { visible: false, service: null },
    socialLinksModal: { visible: false, data: null },
    studiesModal: { visible: false, data: null },
    categoryModal: { visible: false, data: null },
    infoProfesionalModal: { visible: false, data: null },
    editHeaderModal: { visible: false, artist: null },
    editProductModal: { visible: false, product: null },
    editEventModal: { visible: false, event: null },
    companyModal: { visible: false, artist: null },
    videoModal: { visible: false, video: null },
  }),
}));
