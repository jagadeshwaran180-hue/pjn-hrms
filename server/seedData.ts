import type { DatabaseSchema } from './types.ts';

export const initialDatabaseData: DatabaseSchema = {
  leaves: [
    {
      id: 'LR-101',
      empId: 'EMP-005',
      name: 'Arun Kumar',
      department: 'Human Resources',
      leaveType: 'Annual Leave',
      startDate: '18 Nov 2026',
      endDate: '20 Nov 2026',
      days: 3,
      reason: 'Family wedding event in native town',
      status: 'Pending',
      appliedOn: '15 Nov 2026',
      version: 1
    },
    {
      id: 'LR-102',
      empId: 'EMP-006',
      name: 'Priya S',
      department: 'Quality Assurance',
      leaveType: 'Sick Leave',
      startDate: '16 Nov 2026',
      endDate: '17 Nov 2026',
      days: 2,
      reason: 'Viral fever, resting under prescription',
      status: 'Approved',
      appliedOn: '15 Nov 2026',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-15T10:00:00Z',
      version: 1
    },
    {
      id: 'LR-103',
      empId: 'EMP-007',
      name: 'Rahul M',
      department: 'DevOps & Cloud',
      leaveType: 'Casual Leave',
      startDate: '21 Nov 2026',
      endDate: '21 Nov 2026',
      days: 1,
      reason: 'Personal bank and paperwork appointment',
      status: 'Pending',
      appliedOn: '16 Nov 2026',
      version: 1
    },
    {
      id: 'LR-104',
      empId: 'EMP-003',
      name: 'Karthick R',
      department: 'Mobile Apps',
      leaveType: 'Annual Leave',
      startDate: '01 Dec 2026',
      endDate: '05 Dec 2026',
      days: 4, // 05 Dec 2026 is Saturday (weekly off excluded by corporate policy)
      reason: 'Year-end planned vacation',
      status: 'Approved',
      appliedOn: '10 Nov 2026',
      processedBy: 'Imran M (MANAGER)',
      processedAt: '2026-11-10T11:00:00Z',
      version: 1
    },
    {
      id: 'LR-105',
      empId: 'EMP-001',
      name: 'Jagadeesh K',
      department: 'Engineering',
      leaveType: 'Annual Leave',
      startDate: '24 Nov 2026',
      endDate: '25 Nov 2026',
      days: 2,
      reason: 'Personal family occasion',
      status: 'Pending',
      appliedOn: '16 Nov 2026',
      version: 1
    },
    {
      id: 'LR-106',
      empId: 'EMP-002',
      name: 'Imran M',
      department: 'Engineering',
      leaveType: 'Casual Leave',
      startDate: '28 Nov 2026',
      endDate: '28 Nov 2026',
      days: 1,
      reason: 'Personal errands and bank consultation',
      status: 'Pending',
      appliedOn: '16 Nov 2026',
      version: 1
    }
  ],
  hybridRequests: [
    {
      id: 'HYB-201',
      empId: 'EMP-003',
      name: 'Karthick R',
      department: 'Mobile Apps',
      startDate: '18 Nov 2026',
      endDate: '20 Nov 2026',
      reason: 'Client device testing from home lab setup',
      status: 'Pending',
      appliedOn: '16 Nov 2026',
      version: 1
    },
    {
      id: 'HYB-202',
      empId: 'EMP-004',
      name: 'Ayesha N',
      department: 'Backend',
      startDate: '17 Nov 2026',
      endDate: '17 Nov 2026',
      reason: 'Sprint planning and offsite network maintenance',
      status: 'Approved',
      appliedOn: '15 Nov 2026',
      approvedBy: 'Admin User (ADMIN)',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-15T14:30:00Z',
      validUntil: '17 Nov 2026',
      version: 1
    },
    {
      id: 'HYB-203',
      empId: 'EMP-006',
      name: 'Priya S',
      department: 'Quality Assurance',
      startDate: '18 Nov 2026', // Starts 18 Nov post-sick-leave to eliminate 17 Nov conflict
      endDate: '19 Nov 2026',
      reason: 'Personal recovery post-illness (doctor certified)',
      status: 'Approved',
      appliedOn: '14 Nov 2026',
      approvedBy: 'Admin User (ADMIN)',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-14T09:00:00Z',
      validUntil: '19 Nov 2026',
      version: 1
    },
    {
      id: 'HYB-204',
      empId: 'EMP-007',
      name: 'Rahul M',
      department: 'DevOps & Cloud',
      startDate: '10 Nov 2026',
      endDate: '12 Nov 2026',
      reason: 'Datacenter migration overnight shift recovery',
      status: 'Revoked',
      appliedOn: '08 Nov 2026',
      approvedBy: 'Admin User (ADMIN)',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-10T16:00:00Z',
      validUntil: '12 Nov 2026',
      rejectionReason: 'Revoked due to emergency on-site hardware upgrade',
      version: 1
    },
    {
      id: 'HYB-205',
      empId: 'EMP-011',
      name: 'Sneha Patel',
      department: 'Mobile Apps',
      startDate: '17 Nov 2026',
      endDate: '20 Nov 2026',
      reason: 'Design system asset production & remote usability review',
      status: 'Approved',
      appliedOn: '15 Nov 2026',
      approvedBy: 'Admin User (ADMIN)',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-15T16:00:00Z',
      validUntil: '20 Nov 2026',
      version: 1
    },
    {
      id: 'HYB-206',
      empId: 'EMP-002',
      name: 'Imran M',
      department: 'Engineering',
      startDate: '25 Nov 2026',
      endDate: '26 Nov 2026',
      reason: 'Architecture review remote focus sprint',
      status: 'Pending',
      appliedOn: '16 Nov 2026',
      version: 1
    }
  ],
  regularizationRequests: [
    {
      id: 'REG-501',
      empId: 'EMP-001',
      name: 'Jagadeesh K',
      department: 'Engineering',
      date: '14 Nov 2026',
      originalPunch: 'Check-In: 09:15 AM | Check-Out: --:--',
      requestedPunch: 'Check-Out: 06:30 PM',
      type: 'Missed Check-Out',
      reason: 'Left in a hurry for team client deployment meeting; forgot mobile punch',
      status: 'Pending',
      appliedOn: '15 Nov 2026',
      version: 1
    },
    {
      id: 'REG-502',
      empId: 'EMP-004',
      name: 'Ayesha N',
      department: 'Backend',
      date: '12 Nov 2026',
      originalPunch: 'Check-In: --:-- | Check-Out: 06:10 PM',
      requestedPunch: 'Check-In: 09:30 AM',
      type: 'GPS Timeout / Device Glitch',
      reason: 'Mobile OS location services were updating; logged on-site manually with security',
      status: 'Approved',
      appliedOn: '13 Nov 2026',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-13T12:00:00Z',
      version: 1
    },
    {
      id: 'REG-503',
      empId: 'EMP-007',
      name: 'Rahul M',
      department: 'DevOps & Cloud',
      date: '11 Nov 2026',
      originalPunch: 'Check-In: 10:45 AM | Check-Out: 07:15 PM',
      requestedPunch: 'Check-In: 09:00 AM (Client Location)',
      type: 'On-Duty Client Visit',
      reason: 'Traveled directly to AWS data center for physical rack inspection',
      status: 'Approved',
      appliedOn: '11 Nov 2026',
      processedBy: 'Admin User (ADMIN)',
      processedAt: '2026-11-11T14:00:00Z',
      version: 1
    },
    {
      id: 'REG-504',
      empId: 'EMP-003',
      name: 'Karthick R',
      department: 'Mobile Apps',
      date: '15 Nov 2026',
      originalPunch: 'Check-In: 09:40 AM | Check-Out: 06:15 PM',
      requestedPunch: 'Check-In: 09:05 AM',
      type: 'GPS Timeout / Device Glitch',
      reason: 'Android GPS geofence flutter at reception entrance',
      status: 'Pending',
      appliedOn: '16 Nov 2026',
      version: 1
    },
    {
      id: 'REG-505',
      empId: 'EMP-002',
      name: 'Imran M',
      department: 'Engineering',
      date: '13 Nov 2026',
      originalPunch: 'Check-In: 09:10 AM | Check-Out: --:--',
      requestedPunch: 'Check-Out: 07:00 PM',
      type: 'Missed Check-Out',
      reason: 'Evening client sync extended past standard office hours',
      status: 'Pending',
      appliedOn: '14 Nov 2026',
      version: 1
    }
  ],
  attendanceLogs: [
    {
      id: 'ATT-ADM',
      empId: 'EMP-ADM',
      name: 'Admin User',
      department: 'Human Resources',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:02 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present',
      distanceMeters: 14
    },
    {
      id: 'ATT-001',
      empId: 'EMP-001',
      name: 'Jagadeesh K',
      department: 'Engineering',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:15 AM',
      checkOut: '--:--', // Future check-out 06:20 PM removed; active session
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present',
      distanceMeters: 24
    },
    {
      id: 'ATT-002',
      empId: 'EMP-002',
      name: 'Imran M',
      department: 'Engineering',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:10 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present',
      distanceMeters: 12
    },
    {
      id: 'ATT-003',
      empId: 'EMP-003',
      name: 'Karthick R',
      department: 'Mobile Apps',
      branch: 'MAA-01',
      date: '17 Nov 2026',
      checkIn: '09:20 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present',
      distanceMeters: 45
    },
    {
      id: 'ATT-004',
      empId: 'EMP-004',
      name: 'Ayesha N',
      department: 'Backend',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:48 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Hybrid Approved', // Valid active approval HYB-202 on 17 Nov
      status: 'Late', // Checked in after shift cutoff 09:15 AM
      distanceMeters: 0 // Remote attendance: clean 0m, no fabricated distance
    },
    {
      id: 'ATT-005',
      empId: 'EMP-005',
      name: 'Arun Kumar',
      department: 'Human Resources',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:08 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present', // Active and present on 17 Nov; leave LR-101 is 18-20 Nov Pending
      distanceMeters: 28
    },
    {
      id: 'ATT-006',
      empId: 'EMP-006',
      name: 'Priya S',
      department: 'Quality Assurance',
      branch: 'HYD-01',
      date: '17 Nov 2026',
      checkIn: '--:--',
      checkOut: '--:--',
      workHours: '00h 00m',
      locationStatus: 'Approved Leave',
      status: 'On Leave', // Approved Sick Leave LR-102 covers 16-17 Nov
      distanceMeters: 0
    },
    {
      id: 'ATT-007',
      empId: 'EMP-007',
      name: 'Rahul M',
      department: 'DevOps & Cloud',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:55 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Late',
      distanceMeters: 82
    },
    {
      id: 'ATT-008',
      empId: 'EMP-008',
      name: 'Trupthi V',
      department: 'Database',
      branch: 'MAA-01',
      date: '17 Nov 2026',
      checkIn: '09:12 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present',
      distanceMeters: 18
    },
    {
      id: 'ATT-009',
      empId: 'EMP-009',
      name: 'Anuvrath P',
      department: 'Backend',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '--:--',
      checkOut: '--:--',
      workHours: '00h 00m',
      locationStatus: 'N/A',
      status: 'Absent', // Scheduled staff with no punch past policy cutoff
      distanceMeters: 0
    },
    {
      id: 'ATT-010',
      empId: 'EMP-010',
      name: 'Amrutha K',
      department: 'Quality Assurance',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:18 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Present',
      distanceMeters: 15
    },
    {
      id: 'ATT-011',
      empId: 'EMP-011',
      name: 'Sneha Patel',
      department: 'Mobile Apps',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:14 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Hybrid Approved', // Valid active approval HYB-205 on 17 Nov
      status: 'Present',
      distanceMeters: 0 // Remote attendance
    },
    {
      id: 'ATT-012',
      empId: 'EMP-012',
      name: 'Vikram Singh',
      department: 'Engineering',
      branch: 'BLR-HQ',
      date: '17 Nov 2026',
      checkIn: '09:42 AM',
      checkOut: '--:--',
      workHours: 'In Progress',
      locationStatus: 'Inside Geofence',
      status: 'Late',
      distanceMeters: 55
    }
  ],
  employees: [
    {
        "id": "EMP-001",
        "name": "Jagadeesh K",
        "department": "Engineering",
        "designation": "Frontend Lead",
        "email": "jagadeesh@pjntech.com",
        "status": "Active",
        "joinDate": "12 Jan 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-002",
        "name": "Imran M",
        "department": "Engineering",
        "designation": "Engineering Project Lead",
        "email": "imran@pjntech.com",
        "status": "Active",
        "joinDate": "01 Mar 2022",
        "role": "MANAGER",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-003",
        "name": "Karthick R",
        "department": "Mobile Apps",
        "designation": "React Native Dev",
        "email": "karthick@pjntech.com",
        "status": "Active",
        "joinDate": "15 Jun 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01"
    },
    {
        "id": "EMP-004",
        "name": "Ayesha N",
        "department": "Backend",
        "designation": "Spring Boot Lead",
        "email": "ayesha@pjntech.com",
        "status": "Active",
        "joinDate": "10 Aug 2022",
        "role": "EMPLOYEE",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-005",
        "name": "Arun Kumar",
        "department": "Human Resources",
        "designation": "Senior HR Manager",
        "email": "hr@pjntech.com",
        "status": "Active",
        "joinDate": "05 Jan 2024",
        "role": "HR",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-006",
        "name": "Priya S",
        "department": "Quality Assurance",
        "designation": "QA Engineer",
        "email": "priya@pjntech.com",
        "status": "Active",
        "joinDate": "20 Sep 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01"
    },
    {
        "id": "EMP-007",
        "name": "Rahul M",
        "department": "DevOps & Cloud",
        "designation": "DevOps Engineer",
        "email": "rahul@pjntech.com",
        "status": "Active",
        "joinDate": "03 Nov 2023",
        "role": "EMPLOYEE",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-008",
        "name": "Trupthi V",
        "department": "Database",
        "designation": "Database Architect",
        "email": "trupthi@pjntech.com",
        "status": "Active",
        "joinDate": "18 Jul 2022",
        "role": "EMPLOYEE",
        "branch": "MAA-01"
    },
    {
        "id": "EMP-009",
        "name": "Anuvrath P",
        "department": "Backend",
        "designation": "Senior Java Developer",
        "email": "anuvrath@pjntech.com",
        "status": "Active",
        "joinDate": "14 Feb 2023",
        "role": "EMPLOYEE",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-010",
        "name": "Amrutha K",
        "department": "Quality Assurance",
        "designation": "Senior QA Specialist",
        "email": "amrutha@pjntech.com",
        "status": "Active",
        "joinDate": "19 May 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-011",
        "name": "Sneha Patel",
        "department": "Mobile Apps",
        "designation": "UI/UX Specialist",
        "email": "sneha@pjntech.com",
        "status": "Active",
        "joinDate": "11 Apr 2023",
        "role": "EMPLOYEE",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-012",
        "name": "Vikram Singh",
        "department": "Engineering",
        "designation": "Fullstack Engineer",
        "email": "vikram@pjntech.com",
        "status": "Active",
        "joinDate": "08 Aug 2023",
        "role": "EMPLOYEE",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-ADM",
        "name": "Admin User",
        "department": "Human Resources",
        "designation": "System & HR Administrator",
        "email": "admin@pjntech.com",
        "status": "Active",
        "joinDate": "01 Jan 2021",
        "role": "ADMIN",
        "branch": "BLR-HQ"
    },
    {
        "id": "EMP-013",
        "name": "Devi Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "devi.kulkarni@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-014",
        "name": "Jaya Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "jaya.nair@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-015",
        "name": "Meera Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "meera.mukherjee@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-016",
        "name": "Prakash Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "prakash.patil@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-017",
        "name": "Rekha Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "rekha.joshi@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-018",
        "name": "Sarita Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "sarita.kulkarni@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-019",
        "name": "Smita Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "smita.nair@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-020",
        "name": "Uday Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "uday.mukherjee@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-021",
        "name": "Vinod Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "vinod.patil@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-022",
        "name": "Amita Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "amita.joshi@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-023",
        "name": "Devi Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "devi.kulkarni23@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-024",
        "name": "Jaya Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "jaya.nair24@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-025",
        "name": "Meera Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "meera.mukherjee25@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-026",
        "name": "Prakash Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "prakash.patil26@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-027",
        "name": "Rekha Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "rekha.joshi27@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-028",
        "name": "Sarita Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "sarita.kulkarni28@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-029",
        "name": "Smita Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "smita.nair29@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-030",
        "name": "Uday Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "uday.mukherjee30@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-031",
        "name": "Vinod Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "vinod.patil31@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-032",
        "name": "Amita Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "amita.joshi32@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-033",
        "name": "Devi Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "devi.kulkarni33@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-034",
        "name": "Jaya Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "jaya.nair34@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-035",
        "name": "Meera Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "meera.mukherjee35@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-036",
        "name": "Prakash Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "prakash.patil36@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-037",
        "name": "Rekha Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "rekha.joshi37@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-038",
        "name": "Sarita Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "sarita.kulkarni38@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-039",
        "name": "Smita Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "smita.nair39@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-040",
        "name": "Uday Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "uday.mukherjee40@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-041",
        "name": "Vinod Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "vinod.patil41@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-042",
        "name": "Amita Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "amita.joshi42@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-043",
        "name": "Devi Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "devi.kulkarni43@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-044",
        "name": "Jaya Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "jaya.nair44@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-045",
        "name": "Meera Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "meera.mukherjee45@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-046",
        "name": "Prakash Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "prakash.patil46@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-047",
        "name": "Rekha Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "rekha.joshi47@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-048",
        "name": "Sarita Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "sarita.kulkarni48@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-049",
        "name": "Smita Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "smita.nair49@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-050",
        "name": "Uday Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "uday.mukherjee50@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-051",
        "name": "Vinod Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "vinod.patil51@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-052",
        "name": "Amita Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "amita.joshi52@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-053",
        "name": "Devi Kulkarni",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "devi.kulkarni53@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-054",
        "name": "Jaya Nair",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "jaya.nair54@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-055",
        "name": "Meera Mukherjee",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "meera.mukherjee55@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-056",
        "name": "Prakash Patil",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "prakash.patil56@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-057",
        "name": "Rekha Joshi",
        "department": "Engineering",
        "designation": "Engineering Specialist",
        "email": "rekha.joshi57@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-058",
        "name": "Archana Gupta",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "archana.gupta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-059",
        "name": "Gaurav Bhat",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "gaurav.bhat@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-060",
        "name": "Kavita Patel",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "kavita.patel@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-061",
        "name": "Neha Das",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "neha.das@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-062",
        "name": "Rajan Pillai",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "rajan.pillai@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-063",
        "name": "Rohit Gupta",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "rohit.gupta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-064",
        "name": "Shikha Bhat",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "shikha.bhat@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-065",
        "name": "Sunil Patel",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "sunil.patel@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-066",
        "name": "Vandana Das",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "vandana.das@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-067",
        "name": "Yogesh Pillai",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "yogesh.pillai@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-068",
        "name": "Archana Gupta",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "archana.gupta68@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-069",
        "name": "Gaurav Bhat",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "gaurav.bhat69@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-070",
        "name": "Kavita Patel",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "kavita.patel70@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-071",
        "name": "Neha Das",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "neha.das71@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-072",
        "name": "Rajan Pillai",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "rajan.pillai72@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-073",
        "name": "Rohit Gupta",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "rohit.gupta73@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-074",
        "name": "Shikha Bhat",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "shikha.bhat74@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-075",
        "name": "Sunil Patel",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "sunil.patel75@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-076",
        "name": "Vandana Das",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "vandana.das76@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-077",
        "name": "Yogesh Pillai",
        "department": "Mobile Apps",
        "designation": "Mobile Apps Specialist",
        "email": "yogesh.pillai77@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-078",
        "name": "Tarun Roy",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "tarun.roy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-079",
        "name": "Vinay Sharma",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "vinay.sharma@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-080",
        "name": "Akash Bose",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "akash.bose@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-081",
        "name": "Deepak Prabhu",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "deepak.prabhu@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-082",
        "name": "Indira Iyer",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "indira.iyer@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-083",
        "name": "Manish Roy",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "manish.roy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-084",
        "name": "Pooja Sharma",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "pooja.sharma@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-085",
        "name": "Ravi Bose",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "ravi.bose@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-086",
        "name": "Santosh Prabhu",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "santosh.prabhu@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-087",
        "name": "Siddharth Iyer",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "siddharth.iyer@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-088",
        "name": "Tarun Roy",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "tarun.roy88@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-089",
        "name": "Vinay Sharma",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "vinay.sharma89@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-090",
        "name": "Akash Bose",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "akash.bose90@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-091",
        "name": "Deepak Prabhu",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "deepak.prabhu91@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-092",
        "name": "Indira Iyer",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "indira.iyer92@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-093",
        "name": "Manish Roy",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "manish.roy93@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-094",
        "name": "Pooja Sharma",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "pooja.sharma94@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-095",
        "name": "Ravi Bose",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "ravi.bose95@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-096",
        "name": "Santosh Prabhu",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "santosh.prabhu96@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-097",
        "name": "Siddharth Iyer",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "siddharth.iyer97@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-098",
        "name": "Tarun Roy",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "tarun.roy98@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-099",
        "name": "Vinay Sharma",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "vinay.sharma99@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-100",
        "name": "Akash Bose",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "akash.bose100@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-101",
        "name": "Deepak Prabhu",
        "department": "Backend",
        "designation": "Backend Specialist",
        "email": "deepak.prabhu101@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-102",
        "name": "Vinay Bose",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "vinay.bose@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-103",
        "name": "Akash Prabhu",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "akash.prabhu@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-104",
        "name": "Deepak Iyer",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "deepak.iyer@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-105",
        "name": "Indira Roy",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "indira.roy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-106",
        "name": "Manish Sharma",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "manish.sharma@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-107",
        "name": "Pooja Bose",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "pooja.bose@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-108",
        "name": "Ravi Prabhu",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "ravi.prabhu@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-109",
        "name": "Santosh Iyer",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "santosh.iyer@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-110",
        "name": "Siddharth Roy",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "siddharth.roy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-111",
        "name": "Tarun Sharma",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "tarun.sharma@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-112",
        "name": "Vinay Bose",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "vinay.bose112@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-113",
        "name": "Akash Prabhu",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "akash.prabhu113@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-114",
        "name": "Deepak Iyer",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "deepak.iyer114@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-115",
        "name": "Indira Roy",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "indira.roy115@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-116",
        "name": "Manish Sharma",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "manish.sharma116@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-117",
        "name": "Pooja Bose",
        "department": "Quality Assurance",
        "designation": "Quality Assurance Specialist",
        "email": "pooja.bose117@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-118",
        "name": "Manish Gupta",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "manish.gupta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-119",
        "name": "Pooja Bhat",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "pooja.bhat@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-120",
        "name": "Ravi Patel",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "ravi.patel@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-121",
        "name": "Santosh Das",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "santosh.das@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-122",
        "name": "Siddharth Pillai",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "siddharth.pillai@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-123",
        "name": "Tarun Gupta",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "tarun.gupta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-124",
        "name": "Vinay Bhat",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "vinay.bhat@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-125",
        "name": "Akash Patel",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "akash.patel@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-126",
        "name": "Deepak Das",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "deepak.das@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-127",
        "name": "Indira Pillai",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "indira.pillai@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-128",
        "name": "Manish Gupta",
        "department": "Database",
        "designation": "Database Specialist",
        "email": "manish.gupta128@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-129",
        "name": "Krishna Singh",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "krishna.singh@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-130",
        "name": "Nitin Hegde",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "nitin.hegde@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-131",
        "name": "Rajesh Reddy",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "rajesh.reddy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-132",
        "name": "Sandeep Dutta",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "sandeep.dutta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-133",
        "name": "Shilpa Acharya",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "shilpa.acharya@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-134",
        "name": "Sunita Singh",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "sunita.singh@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-135",
        "name": "Vasundhara Hegde",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "vasundhara.hegde@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-136",
        "name": "Zoya Reddy",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "zoya.reddy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-137",
        "name": "Ashok Dutta",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "ashok.dutta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-138",
        "name": "Geeta Acharya",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "geeta.acharya@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-139",
        "name": "Krishna Singh",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "krishna.singh139@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-140",
        "name": "Nitin Hegde",
        "department": "Human Resources",
        "designation": "Human Resources Specialist",
        "email": "nitin.hegde140@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-141",
        "name": "Meera Hegde",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "meera.hegde@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-142",
        "name": "Prakash Reddy",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "prakash.reddy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-143",
        "name": "Rekha Dutta",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "rekha.dutta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-144",
        "name": "Sarita Acharya",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "sarita.acharya@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-145",
        "name": "Smita Singh",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "smita.singh@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-146",
        "name": "Uday Hegde",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "uday.hegde@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-147",
        "name": "Vinod Reddy",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "vinod.reddy@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-148",
        "name": "Amita Dutta",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "amita.dutta@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-149",
        "name": "Devi Acharya",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "devi.acharya@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 6
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-150",
        "name": "Jaya Singh",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "jaya.singh@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "HYD-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 2
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-151",
        "name": "Meera Hegde",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "meera.hegde151@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 3
            },
            "sick": {
                "total": 10,
                "used": 2
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    },
    {
        "id": "EMP-152",
        "name": "Prakash Reddy",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "prakash.reddy152@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "BLR-HQ",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 4
            },
            "sick": {
                "total": 10,
                "used": 3
            },
            "casual": {
                "total": 7,
                "used": 1
            }
        }
    },
    {
        "id": "EMP-153",
        "name": "Rekha Dutta",
        "department": "DevOps & Cloud",
        "designation": "DevOps & Cloud Specialist",
        "email": "rekha.dutta153@pjntech.com",
        "status": "Active",
        "joinDate": "15 Mar 2023",
        "role": "EMPLOYEE",
        "managerId": "EMP-002",
        "branch": "MAA-01",
        "leaveBalances": {
            "annual": {
                "total": 18,
                "used": 5
            },
            "sick": {
                "total": 10,
                "used": 1
            },
            "casual": {
                "total": 7,
                "used": 2
            }
        }
    }
],
  branches: [
    {
      id: 'BR-01',
      name: 'PJN Tech Headquarters',
      code: 'BLR-HQ',
      address: 'EcoWorld Tech Park, Outer Ring Road, Bangalore - 560103',
      latitude: 12.9238,
      longitude: 77.6834,
      geofenceRadiusMeters: 100,
      employeeCount: 98,
      status: 'Active'
    },
    {
      id: 'BR-02',
      name: 'Chennai Innovation Hub',
      code: 'MAA-01',
      address: 'Tidel Park, Rajiv Gandhi Salai, Taramani, Chennai - 600113',
      latitude: 12.9897,
      longitude: 80.2486,
      geofenceRadiusMeters: 100,
      employeeCount: 36,
      status: 'Active'
    },
    {
      id: 'BR-03',
      name: 'Hyderabad Development Center',
      code: 'HYD-01',
      address: 'HITEC City, Madhapur, Hyderabad - 500081',
      latitude: 17.4485,
      longitude: 78.3742,
      geofenceRadiusMeters: 100,
      employeeCount: 20,
      status: 'Active'
    }
  ],
  shifts: [
    {
      id: 'SH-01',
      name: 'General Corporate Shift',
      startTime: '09:00 AM',
      endTime: '06:00 PM',
      graceTimeMinutes: 15,
      assignedStaff: 112,
      type: 'Regular'
    },
    {
      id: 'SH-02',
      name: 'Engineering Flexible Shift',
      startTime: '10:00 AM',
      endTime: '07:00 PM',
      graceTimeMinutes: 30,
      assignedStaff: 30,
      type: 'Flexible'
    },
    {
      id: 'SH-03',
      name: 'DevOps 24/7 Cloud Rotational',
      startTime: '09:00 PM',
      endTime: '06:00 AM',
      graceTimeMinutes: 10,
      assignedStaff: 12,
      type: 'Overnight'
    }
  ],
  holidays: [
    { id: 'HOL-01', name: 'Republic Day', date: '26 Jan 2026', dayOfWeek: 'Monday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-02', name: 'Maha Shivaratri', date: '15 Feb 2026', dayOfWeek: 'Sunday', type: 'Optional Floater', branchApplicability: 'All Branches' },
    { id: 'HOL-03', name: 'Holi Festival', date: '04 Mar 2026', dayOfWeek: 'Wednesday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-04', name: 'Ugadi / Gudi Padwa', date: '19 Mar 2026', dayOfWeek: 'Thursday', type: 'Mandatory', branchApplicability: 'BLR-HQ & HYD-01' },
    { id: 'HOL-05', name: 'May Day', date: '01 May 2026', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-06', name: 'Independence Day', date: '15 Aug 2026', dayOfWeek: 'Saturday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-07', name: 'Gandhi Jayanti', date: '02 Oct 2026', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-08', name: 'Kannada Rajyotsava', date: '01 Nov 2026', dayOfWeek: 'Sunday', type: 'Mandatory', branchApplicability: 'BLR-HQ Only' },
    { id: 'HOL-09', name: 'Diwali (Deepavali)', date: '08 Nov 2026', dayOfWeek: 'Sunday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-10', name: 'Christmas', date: '25 Dec 2026', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-11', name: 'Republic Day', date: '26 Jan 2027', dayOfWeek: 'Tuesday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-12', name: 'Maha Shivaratri', date: '06 Mar 2027', dayOfWeek: 'Saturday', type: 'Optional Floater', branchApplicability: 'All Branches' },
    { id: 'HOL-13', name: 'Holi Festival', date: '23 Mar 2027', dayOfWeek: 'Tuesday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-14', name: 'Ugadi', date: '08 Apr 2027', dayOfWeek: 'Thursday', type: 'Mandatory', branchApplicability: 'BLR-HQ & HYD-01' },
    { id: 'HOL-15', name: 'May Day', date: '01 May 2027', dayOfWeek: 'Saturday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-16', name: 'Independence Day', date: '15 Aug 2027', dayOfWeek: 'Sunday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-17', name: 'Gandhi Jayanti', date: '02 Oct 2027', dayOfWeek: 'Saturday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-18', name: 'Diwali', date: '29 Oct 2027', dayOfWeek: 'Friday', type: 'Mandatory', branchApplicability: 'All Branches' },
    { id: 'HOL-19', name: 'Kannada Rajyotsava', date: '01 Nov 2027', dayOfWeek: 'Monday', type: 'Mandatory', branchApplicability: 'BLR-HQ Only' },
    { id: 'HOL-20', name: 'Christmas', date: '25 Dec 2027', dayOfWeek: 'Saturday', type: 'Mandatory', branchApplicability: 'All Branches' }
  ],
  auditLogs: [
    {
      id: 'AUD-915',
      timestamp: '17 Nov 2026, 09:02 AM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'In-House Attendance Check-In',
      target: 'Branch BLR-HQ (14m inside radius)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-916',
      timestamp: '17 Nov 2026, 09:10 AM',
      actor: 'imran@pjntech.com',
      role: 'MANAGER',
      action: 'In-House Attendance Check-In',
      target: 'Branch BLR-HQ (12m inside radius)',
      ipAddress: '192.168.1.50',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-917',
      timestamp: '17 Nov 2026, 09:15 AM',
      actor: 'jagadeesh@pjntech.com',
      role: 'EMPLOYEE',
      action: 'In-House Attendance Check-In',
      target: 'Branch BLR-HQ (24m inside radius)',
      ipAddress: '192.168.1.45',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-901',
      timestamp: '16 Nov 2026, 03:45 PM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Approved Hybrid Work Authorization',
      target: 'Request #HYB-202 (Ayesha N)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-902',
      timestamp: '16 Nov 2026, 02:30 PM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Updated Branch Geofence Radius',
      target: 'Branch BLR-HQ (Radius changed: 80m -> 100m)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-903',
      timestamp: '16 Nov 2026, 01:15 PM',
      actor: 'jagadeesh@pjntech.com',
      role: 'EMPLOYEE',
      action: 'In-House Attendance Check-In',
      target: 'Branch BLR-HQ (24m inside radius)',
      ipAddress: '192.168.1.45',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-904',
      timestamp: '16 Nov 2026, 11:20 AM',
      actor: 'rahul@pjntech.com',
      role: 'EMPLOYEE',
      action: 'Geofence Perimeter Breach - Check-In Rejected',
      target: 'Check-in attempted 120m from office (Limit: 100m)',
      ipAddress: '49.207.210.88',
      status: 'FAILED'
    },
    {
      id: 'AUD-905',
      timestamp: '16 Nov 2026, 09:40 AM',
      actor: 'Unknown user',
      role: 'UNKNOWN',
      action: 'Failed Login Attempt (Invalid Password)',
      target: 'Account: hr_lead@pjntech.com',
      ipAddress: '185.220.101.5',
      status: 'FAILED'
    },
    {
      id: 'AUD-906',
      timestamp: '15 Nov 2026, 05:10 PM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Revoked Hybrid Attendance (Post-Expiry Revocation)',
      target: 'Request #HYB-204 (Rahul M) - Reason: Revoked due to emergency on-site hardware upgrade',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-907',
      timestamp: '15 Nov 2026, 10:00 AM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Approved Leave Application',
      target: 'Leave Request #LR-102 (Priya S - Sick Leave)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-908',
      timestamp: '14 Nov 2026, 09:00 AM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Approved Hybrid Work Authorization',
      target: 'Request #HYB-203 (Priya S)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-909',
      timestamp: '13 Nov 2026, 12:00 PM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Approved Attendance Regularization',
      target: 'Request #REG-502 (Ayesha N)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-910',
      timestamp: '11 Nov 2026, 02:00 PM',
      actor: 'admin@pjntech.com',
      role: 'ADMIN',
      action: 'Approved Attendance Regularization',
      target: 'Request #REG-503 (Rahul M)',
      ipAddress: '106.51.78.12',
      status: 'SUCCESS'
    },
    {
      id: 'AUD-911',
      timestamp: '10 Nov 2026, 11:00 AM',
      actor: 'imran@pjntech.com',
      role: 'MANAGER',
      action: 'Approved Leave Application',
      target: 'Leave Request #LR-104 (Karthick R - Annual Leave)',
      ipAddress: '192.168.1.50',
      status: 'SUCCESS'
    }
  ],
  settings: {
    geofenceRadiusMeters: 100,
    lateGraceMinutes: 15,
    permissions: [
      { module: 'Dashboard & KPI Insights', admin: true, hr: true, manager: true, employee: true },
      { module: 'Employee CRUD & Profile Management', admin: true, hr: true, manager: false, employee: false },
      { module: 'GPS Attendance Marking (100m Geofence)', admin: true, hr: true, manager: true, employee: true },
      { module: 'Hybrid Attendance Approval & Revocation', admin: true, hr: true, manager: false, employee: false },
      { module: 'Leave Management & Approvals', admin: true, hr: true, manager: true, employee: true },
      { module: 'Shift Scheduling & Assignment', admin: true, hr: true, manager: true, employee: false },
      { module: 'Attendance Regularization & Correction', admin: true, hr: true, manager: true, employee: true },
      { module: 'Holiday Calendar & Company Observances', admin: true, hr: true, manager: true, employee: true },
      { module: 'Company Branch & GPS Setup', admin: true, hr: false, manager: false, employee: false },
      { module: 'Executive Reports & Analytics Export', admin: true, hr: true, manager: true, employee: false },
      { module: 'System Security & Audit Logs', admin: true, hr: false, manager: false, employee: false }
    ]
  }
};
