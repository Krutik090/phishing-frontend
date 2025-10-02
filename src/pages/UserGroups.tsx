import { useState, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Trash, UserPlus, Users, Search, Download, Upload, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
}

interface Group {
  id: number;
  groupName: string;
  users: User[];
}

type FormData = {
  groupName: string;
};

type UserFormData = {
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department: string;
};

const GROUPS_PAGE_SIZE = 10;
const USERS_PAGE_SIZE = 10;

export function UserGroups() {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<FormData>();
  const { register: userRegister, reset: resetUser, formState: { errors: userErrors }, handleSubmit: handleUserSubmit } = useForm<UserFormData>();

  const [groups, setGroups] = useState<Group[]>([
    {
      id: 1,
      groupName: 'HR Department',
      users: [
        {
          id: 1,
          firstName: 'Alice',
          lastName: 'Smith',
          email: 'alice@example.com',
          position: 'HR Manager',
          department: 'Human Resources',
        },
        {
          id: 2,
          firstName: 'Bob',
          lastName: 'Johnson',
          email: 'bob@example.com',
          position: 'Recruiter',
          department: 'Human Resources',
        },
      ],
    },
    {
      id: 2,
      groupName: 'Engineering Team',
      users: [
        {
          id: 3,
          firstName: 'Carol',
          lastName: 'Williams',
          email: 'carol@example.com',
          position: 'Software Engineer',
          department: 'Engineering',
        },
      ],
    },
  ]);

  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [groupPage, setGroupPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered and paginated groups list
  const filteredGroups = useMemo(() => {
    return groups.filter(group =>
      group.groupName.toLowerCase().includes(groupSearchTerm.toLowerCase())
    );
  }, [groups, groupSearchTerm]);

  const paginatedGroups = useMemo(() => {
    const start = (groupPage - 1) * GROUPS_PAGE_SIZE;
    return filteredGroups.slice(start, start + GROUPS_PAGE_SIZE);
  }, [filteredGroups, groupPage]);

  const selectedGroup = groups.find(g => g.id === selectedGroupId) ?? null;

  // Filtered users based on search
  const filteredUsers = useMemo(() => {
    if (!selectedGroup) return [];
    
    if (!userSearchTerm.trim()) {
      return selectedGroup.users;
    }
    
    const searchLower = userSearchTerm.toLowerCase();
    return selectedGroup.users.filter(user => 
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.position.toLowerCase().includes(searchLower) ||
      user.department.toLowerCase().includes(searchLower)
    );
  }, [selectedGroup, userSearchTerm]);

  // Paginated users from filtered results
  const paginatedUsers = useMemo(() => {
    const start = (userPage - 1) * USERS_PAGE_SIZE;
    return filteredUsers.slice(start, start + USERS_PAGE_SIZE);
  }, [filteredUsers, userPage]);

  const totalGroupPages = Math.ceil(filteredGroups.length / GROUPS_PAGE_SIZE);
  const totalUserPages = Math.ceil(filteredUsers.length / USERS_PAGE_SIZE);

  const onCreateGroup = (data: FormData) => {
    const newGroup: Group = {
      id: groups.length ? groups[groups.length - 1].id + 1 : 1,
      groupName: data.groupName.trim(),
      users: [],
    };
    setGroups([...groups, newGroup]);
    reset();
    setSelectedGroupId(newGroup.id);
    setGroupPage(1);
  };

  const onAddUserToGroup = (data: UserFormData) => {
    if (!selectedGroupId) return;

    setGroups(groups.map(group => {
      if (group.id === selectedGroupId) {
        if (group.users.find(u => u.email === data.email.trim())) return group;

        const newUser: User = {
          id: group.users.length ? group.users[group.users.length - 1].id + 1 : 1,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
          email: data.email.trim(),
          position: data.position.trim(),
          department: data.department.trim(),
        };
        return {...group, users: [...group.users, newUser]};
      }
      return group;
    }));

    resetUser();
    setUserPage(1);
  };

  const onRemoveUser = (groupId: number, userId: number) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          users: group.users.filter(user => user.id !== userId),
        };
      }
      return group;
    }));
  };

  const onRemoveGroup = (groupId: number) => {
    setGroups(groups.filter(group => group.id !== groupId));
    if (selectedGroupId === groupId) setSelectedGroupId(null);
  };

  const handleGroupSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGroupSearchTerm(e.target.value);
    setGroupPage(1);
  };

  const handleUserSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserSearchTerm(e.target.value);
    setUserPage(1);
  };

  // Excel Download Template
  const downloadTemplate = () => {
    const template = [
      {
        'First Name': 'John',
        'Last Name': 'Doe',
        'Email': 'john.doe@example.com',
        'Position': 'Software Engineer',
        'Department': 'Engineering',
      },
      {
        'First Name': 'Jane',
        'Last Name': 'Smith',
        'Email': 'jane.smith@example.com',
        'Position': 'HR Manager',
        'Department': 'Human Resources',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users Template');

    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
    ];

    XLSX.writeFile(workbook, 'Users_Import_Template.xlsx');
  };

  // Excel Upload and Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploadSuccess('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        if (jsonData.length === 0) {
          setUploadError('Excel file is empty. Please add user data.');
          return;
        }

        const requiredColumns = ['First Name', 'Last Name', 'Email', 'Position', 'Department'];
        const firstRow = jsonData[0];
        const missingColumns = requiredColumns.filter(col => !(col in firstRow));

        if (missingColumns.length > 0) {
          setUploadError(`Missing required columns: ${missingColumns.join(', ')}`);
          return;
        }

        if (!selectedGroupId) {
          setUploadError('Please select a group first before importing users.');
          return;
        }

        const newUsers: User[] = jsonData.map((row, index) => ({
          id: Date.now() + index,
          firstName: String(row['First Name'] || '').trim(),
          lastName: String(row['Last Name'] || '').trim(),
          email: String(row['Email'] || '').trim().toLowerCase(),
          position: String(row['Position'] || '').trim(),
          department: String(row['Department'] || '').trim(),
        })).filter(user => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return user.firstName && user.lastName && user.email && emailRegex.test(user.email);
        });

        if (newUsers.length === 0) {
          setUploadError('No valid users found in the Excel file. Please check the data format.');
          return;
        }

        setGroups(groups.map(group => {
          if (group.id === selectedGroupId) {
            const existingEmails = group.users.map(u => u.email);
            const uniqueNewUsers = newUsers.filter(user => !existingEmails.includes(user.email));
            
            return {
              ...group,
              users: [...group.users, ...uniqueNewUsers],
            };
          }
          return group;
        }));

        setUploadSuccess(`Successfully imported ${newUsers.length} users!`);
        setUserPage(1);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }

      } catch (error) {
        setUploadError('Error reading Excel file. Please ensure it is a valid .xlsx or .xls file.');
        console.error('Excel import error:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Export current group users to Excel
  const exportGroupUsers = () => {
    if (!selectedGroup || selectedGroup.users.length === 0) {
      alert('No users to export in the selected group.');
      return;
    }

    const exportData = selectedGroup.users.map(user => ({
      'First Name': user.firstName,
      'Last Name': user.lastName,
      'Email': user.email,
      'Position': user.position,
      'Department': user.department,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 25 },
      { wch: 20 },
    ];

    XLSX.writeFile(workbook, `${selectedGroup.groupName}_Users_Export.xlsx`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">User & Groups Management</h1>
        
        <div className="flex items-center gap-3">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white dark:bg-card text-foreground hover:bg-card-foreground/10 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>
      </div>

      {/* Create Group Form */}
      <form onSubmit={handleSubmit(onCreateGroup)} className="flex flex-col sm:flex-row gap-4 sm:items-end" aria-label="Create new user group">
        <div className="flex-grow">
          <label htmlFor="groupName" className="block text-sm font-medium text-foreground mb-1">New Group Name</label>
          <input
            id="groupName"
            {...register('groupName', { required: 'Group name is required', minLength: { value: 3, message: 'Minimum length is 3' } })}
            type="text"
            placeholder="Enter group name"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-colors dark:bg-card dark:border-border dark:text-card-foreground ${errors.groupName ? 'border-red-600 ring-red-600' : 'border-border'}`}
            aria-invalid={errors.groupName ? 'true' : 'false'}
          />
          {errors.groupName && <p role="alert" className="text-xs text-red-600 mt-1">{errors.groupName.message}</p>}
        </div>
        <button type="submit" className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:from-secondary hover:to-primary transition-all" aria-label="Create group">
          <Plus className="w-5 h-5" /> Create Group
        </button>
      </form>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Groups Panel */}
        <div className="w-full lg:w-1/3 bg-white dark:bg-card border border-border rounded-xl shadow-sm p-4 flex flex-col">
          <h2 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
            <Users className="w-5 h-5" /> Groups
          </h2>
          <div className="mb-3 relative">
            <input
              type="search"
              placeholder="Search groups..."
              value={groupSearchTerm}
              onChange={handleGroupSearchChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              aria-label="Search groups"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>

          <ul className="divide-y divide-border overflow-y-auto max-h-[500px] flex-1" role="list" tabIndex={0}>
            {paginatedGroups.length ? (
              paginatedGroups.map(group => (
                <li
                  key={group.id}
                  className={`p-3 cursor-pointer rounded-lg hover:bg-card-foreground/10 flex justify-between items-center ${
                    selectedGroupId === group.id ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  }`}
                  onClick={() => {
                    setSelectedGroupId(group.id);
                    setUserPage(1);
                    setUserSearchTerm('');
                    setUploadError('');
                    setUploadSuccess('');
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedGroupId(group.id)}
                  aria-pressed={selectedGroupId === group.id}
                >
                  <div className="flex flex-col truncate">
                    <span className="truncate font-medium">{group.groupName}</span>
                    <span className="text-xs opacity-75">{group.users.length} users</span>
                  </div>
                  <button
                    className="flex-shrink-0 p-1 rounded-full hover:bg-red-600 hover:text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGroup(group.id);
                    }}
                    aria-label={`Delete group ${group.groupName}`}
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </li>
              ))
            ) : (
              <li className="text-center py-6 text-gray-500">No groups found.</li>
            )}
          </ul>

          {totalGroupPages > 1 && (
            <nav className="flex justify-between mt-4 text-sm text-gray-600" aria-label="Group pagination">
              <button
                onClick={() => setGroupPage(Math.max(1, groupPage - 1))}
                disabled={groupPage === 1}
                className="px-2 py-1 rounded hover:bg-card-foreground/20 disabled:text-gray-300"
              >
                Previous
              </button>
              <span>
                Page {groupPage} of {totalGroupPages}
              </span>
              <button
                onClick={() => setGroupPage(Math.min(totalGroupPages, groupPage + 1))}
                disabled={groupPage === totalGroupPages}
                className="px-2 py-1 rounded hover:bg-card-foreground/20 disabled:text-gray-300"
              >
                Next
              </button>
            </nav>
          )}
        </div>

        {/* Users Panel */}
        <div className="flex-1 bg-white dark:bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <UserPlus className="w-5 h-5" /> {selectedGroupId !== null ? selectedGroup?.groupName ?? 'Users' : 'Select a group'}
            </h2>
            
            {selectedGroupId !== null && (
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white dark:bg-card text-foreground hover:bg-card-foreground/10 transition-all cursor-pointer shadow-sm"
                >
                  <Upload className="w-4 h-4" />
                  Import Excel
                </label>
                
                {selectedGroup && selectedGroup.users.length > 0 && (
                  <button
                    onClick={exportGroupUsers}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-white dark:bg-card text-foreground hover:bg-card-foreground/10 transition-all shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    Export Excel
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Upload Status Messages */}
          {uploadError && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-800 dark:text-red-300">
              {uploadError}
            </div>
          )}
          
          {uploadSuccess && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-800 dark:text-green-300">
              {uploadSuccess}
            </div>
          )}

          {selectedGroupId !== null && (
            <>
              {/* Add User Form */}
              <form onSubmit={handleUserSubmit(onAddUserToGroup)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" aria-label="Add user to group">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-1">First Name</label>
                  <input
                    id="firstName"
                    {...userRegister('firstName', { required: 'First name is required' })}
                    type="text"
                    placeholder="First name"
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${userErrors.firstName ? 'border-red-600 ring-red-600' : 'border-border'}`}
                    aria-invalid={userErrors.firstName ? 'true' : 'false'}
                  />
                  {userErrors.firstName && <p role="alert" className="text-xs text-red-600 mt-1">{userErrors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                  <input
                    id="lastName"
                    {...userRegister('lastName', { required: 'Last name is required' })}
                    type="text"
                    placeholder="Last name"
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${userErrors.lastName ? 'border-red-600 ring-red-600' : 'border-border'}`}
                    aria-invalid={userErrors.lastName ? 'true' : 'false'}
                  />
                  {userErrors.lastName && <p role="alert" className="text-xs text-red-600 mt-1">{userErrors.lastName.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">Email</label>
                  <input
                    id="email"
                    {...userRegister('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: 'Invalid email format',
                      },
                    })}
                    type="email"
                    placeholder="user@example.com"
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${userErrors.email ? 'border-red-600 ring-red-600' : 'border-border'}`}
                    aria-invalid={userErrors.email ? 'true' : 'false'}
                  />
                  {userErrors.email && <p role="alert" className="text-xs text-red-600 mt-1">{userErrors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-foreground mb-1">Position</label>
                  <input
                    id="position"
                    {...userRegister('position', { required: 'Position is required' })}
                    type="text"
                    placeholder="Position"
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${userErrors.position ? 'border-red-600 ring-red-600' : 'border-border'}`}
                    aria-invalid={userErrors.position ? 'true' : 'false'}
                  />
                  {userErrors.position && <p role="alert" className="text-xs text-red-600 mt-1">{userErrors.position.message}</p>}
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-foreground mb-1">Department</label>
                  <input
                    id="department"
                    {...userRegister('department', { required: 'Department is required' })}
                    type="text"
                    placeholder="Department"
                    className={`w-full px-3 py-2 border rounded-lg dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors ${userErrors.department ? 'border-red-600 ring-red-600' : 'border-border'}`}
                    aria-invalid={userErrors.department ? 'true' : 'false'}
                  />
                  {userErrors.department && <p role="alert" className="text-xs text-red-600 mt-1">{userErrors.department.message}</p>}
                </div>

                <div className="flex items-end justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-md hover:from-secondary hover:to-primary transition-all"
                    aria-label="Add user to group"
                  >
                    Add User
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </form>

              {/* User Search Bar */}
              <div className="mb-4 relative">
                <input
                  type="search"
                  placeholder="Search users by name, email, position, or department..."
                  value={userSearchTerm}
                  onChange={handleUserSearchChange}
                  className="w-full pl-10 pr-20 py-2 rounded-lg border border-border dark:bg-card dark:border-border dark:text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                  aria-label="Search users"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                {userSearchTerm && (
                  <span className="absolute right-3 top-2.5 text-xs text-gray-500">
                    {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* User List */}
              <ul className="flex-1 overflow-y-auto divide-y divide-border">
                {paginatedUsers.length ? (
                  paginatedUsers.map((user) => (
                    <li key={user.id} className="py-3 flex justify-between items-center text-foreground hover:bg-card-foreground/5 px-2 rounded transition-colors">
                      <div className="truncate">
                        <strong className="text-base">{user.firstName} {user.lastName}</strong> <br />
                        <small className="text-gray-600 dark:text-gray-400">{user.position} — {user.department}</small>
                        <br />
                        <a href={`mailto:${user.email}`} className="text-primary underline truncate text-sm">{user.email}</a>
                      </div>
                      <button
                        onClick={() => onRemoveUser(selectedGroupId, user.id)}
                        className="text-red-600 hover:text-red-800 flex-shrink-0 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        aria-label={`Remove user ${user.firstName} ${user.lastName}`}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 py-4 text-center">
                    {userSearchTerm ? 'No users found matching your search.' : 'No users found.'}
                  </li>
                )}
              </ul>

              {/* User Pagination */}
              {totalUserPages > 1 && (
                <nav className="flex justify-between mt-4 text-sm text-gray-600" aria-label="User pagination">
                  <button
                    onClick={() => setUserPage(Math.max(1, userPage - 1))}
                    disabled={userPage === 1}
                    className="px-2 py-1 rounded hover:bg-card-foreground/20 disabled:text-gray-300"
                  >
                    Previous
                  </button>
                  <span>
                    Page {userPage} of {totalUserPages}
                  </span>
                  <button
                    onClick={() => setUserPage(Math.min(totalUserPages, userPage + 1))}
                    disabled={userPage === totalUserPages}
                    className="px-2 py-1 rounded hover:bg-card-foreground/20 disabled:text-gray-300"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}

          {selectedGroupId === null && (
            <div className="flex-1 flex items-center justify-center text-gray-500 py-12">
              <div className="text-center">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-sm">Select a group to manage users</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
