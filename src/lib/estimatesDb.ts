import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SavedProjectEstimate, ContractorProfile, MaterialItem } from '../types';
import { VERIFIED_CONTRACTORS, BUILDING_MATERIALS_CATALOG } from '../data/contractorsAndMaterialsData';

export interface CloudEstimateRecord {
  id: string;
  userId: string;
  title: string;
  category: string;
  engineType: 'shell-to-slab' | 'basement-attic' | 'diy-regret' | 'other';
  date: string;
  totalCost: number;
  diyCost?: number;
  sqft?: number;
  progressPercent?: number;
  location?: string;
  qualityTier?: string;
  details?: any;
  createdAt?: any;
}

// ----------------------------------------------------------------------
// ESTIMATES
// ----------------------------------------------------------------------

export async function saveEstimateToCloud(
  userId: string,
  estimate: SavedProjectEstimate,
  meta?: {
    engineType?: 'shell-to-slab' | 'basement-attic' | 'diy-regret' | 'other';
    sqft?: number;
    location?: string;
    qualityTier?: string;
  }
): Promise<void> {
  const estimateDocRef = doc(db, 'users', userId, 'estimates', estimate.id);
  const data: CloudEstimateRecord = {
    id: estimate.id,
    userId,
    title: estimate.title,
    category: estimate.category,
    engineType: meta?.engineType || (estimate.category === 'home-reno' ? 'shell-to-slab' : 'other'),
    date: estimate.date,
    totalCost: estimate.result.costToFinishContractor || estimate.result.totalScopeCost || 0,
    diyCost: estimate.result.costToFinishDIY,
    sqft: meta?.sqft || estimate.result.effectiveSqFt,
    progressPercent: estimate.result.completedPercentage,
    location: meta?.location,
    qualityTier: meta?.qualityTier,
    details: estimate.result,
    createdAt: serverTimestamp(),
  };

  await setDoc(estimateDocRef, data);
}

export async function fetchUserEstimates(userId: string): Promise<CloudEstimateRecord[]> {
  try {
    const estimatesCol = collection(db, 'users', userId, 'estimates');
    const q = query(estimatesCol, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const records: CloudEstimateRecord[] = [];
    snapshot.forEach((d) => {
      records.push(d.data() as CloudEstimateRecord);
    });
    return records;
  } catch (err) {
    console.warn('Could not fetch cloud estimates, returning empty:', err);
    return [];
  }
}

export async function deleteEstimateFromCloud(userId: string, estimateId: string): Promise<void> {
  const estimateDocRef = doc(db, 'users', userId, 'estimates', estimateId);
  await deleteDoc(estimateDocRef);
}

// ----------------------------------------------------------------------
// CONTRACTORS
// ----------------------------------------------------------------------

export async function fetchContractorsList(): Promise<ContractorProfile[]> {
  try {
    const contractorsCol = collection(db, 'contractors');
    const snapshot = await getDocs(contractorsCol);
    if (!snapshot.empty) {
      const list: ContractorProfile[] = [];
      snapshot.forEach((d) => list.push(d.data() as ContractorProfile));
      return list;
    }
  } catch (err) {
    console.warn('Error reading contractors from Firestore, falling back to verified seed:', err);
  }
  return VERIFIED_CONTRACTORS;
}

export async function registerOrUpdateContractor(profile: ContractorProfile): Promise<void> {
  const docRef = doc(db, 'contractors', profile.id);
  await setDoc(docRef, {
    ...profile,
    updatedAt: serverTimestamp(),
  });
}

// ----------------------------------------------------------------------
// MATERIALS
// ----------------------------------------------------------------------

export async function fetchMaterialsCatalog(): Promise<MaterialItem[]> {
  try {
    const materialsCol = collection(db, 'materials');
    const snapshot = await getDocs(materialsCol);
    if (!snapshot.empty) {
      const list: MaterialItem[] = [];
      snapshot.forEach((d) => list.push(d.data() as MaterialItem));
      return list;
    }
  } catch (err) {
    console.warn('Error reading materials from Firestore, using catalog seed:', err);
  }
  return BUILDING_MATERIALS_CATALOG;
}

// ----------------------------------------------------------------------
// INQUIRIES & BIDS
// ----------------------------------------------------------------------

export async function saveContractorInquiryToCloud(inquiry: {
  userId?: string;
  contractorId?: string;
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;
  projectType: string;
  estimatedCost: number;
  timeframe: string;
  mode: 'bids' | 'report' | 'direct_hire';
  notes?: string;
}): Promise<string> {
  const id = 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const inquiryRef = doc(db, 'contractor_inquiries', id);
  await setDoc(inquiryRef, {
    id,
    ...inquiry,
    status: 'pending',
    createdAt: serverTimestamp(),
  });
  return id;
}

export interface CloudInquiryRecord {
  id: string;
  userId?: string;
  contractorId?: string;
  fullName: string;
  email: string;
  phone: string;
  zipCode: string;
  projectType: string;
  estimatedCost: number;
  timeframe: string;
  mode: 'bids' | 'report' | 'direct_hire';
  notes?: string;
  status: 'pending' | 'dispatched' | 'closed' | 'converted';
  createdAt?: any;
}

export async function fetchAllInquiries(): Promise<CloudInquiryRecord[]> {
  try {
    const colRef = collection(db, 'contractor_inquiries');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const results: CloudInquiryRecord[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data() as CloudInquiryRecord);
      });
      return results;
    }
  } catch (err) {
    console.warn('Could not fetch inquiries from cloud:', err);
  }
  return [];
}

export async function fetchAllUsers(): Promise<Array<{
  userId: string;
  email: string;
  displayName: string;
  role: string;
  companyName?: string;
  createdAt?: any;
}>> {
  try {
    const colRef = collection(db, 'users');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const results: any[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data());
      });
      return results;
    }
  } catch (err) {
    console.warn('Could not fetch users from cloud:', err);
  }
  return [];
}

