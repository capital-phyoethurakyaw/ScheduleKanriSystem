USE [ScheduleKanriMaster]
GO
/****** Object:  Table [dbo].[Tenant]    Script Date: 2025-01-29 13:16:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Tenant](
	[TenantID] [varchar](10) NOT NULL,
	[CompanyName] [nvarchar](200) NULL,
	[DBPath] [varchar](100) NULL,
	[DBLogPath] [varchar](100) NULL,
	[CreatedDate] [datetime] NULL,
 CONSTRAINT [PK_Tenant] PRIMARY KEY CLUSTERED 
(
	[TenantID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  StoredProcedure [dbo].[CreateWorkspace]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[CreateWorkspace]
	@TenantID varchar(10),
	@CompanyName nvarchar(100),
	@UserName nvarchar(100),
	@Email varchar(100),
	@Password varchar(10),
	@Position varchar(10),
	@MobileNumber varchar(50)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @d1 as datetime = getdate()
	declare @dbName varchar(100) = 'ScheduleKanri' + '_' + @TenantID
	declare @dbFile varchar(200) = 'C:\SQLData\' + @dbName + '.mdf'
	declare @dbLog varchar(200) = 'C:\SQLData\' + @dbName + '_Log.ldf'
	declare @sql nvarchar(max)
	declare @JsonData varchar(max); -- response
	
	-- create DB
	set @sql = N'
	create database ' + QUOTENAME(@dbName) + N'
	on primary
	(
	    name = ' + QUOTENAME(@dbName + '_Data') + N', 
	    filename = ''' + @dbFile + N''',
	    size = 10MB,
	    maxsize = 100MB,
	    filegrowth = 5MB
	)
	LOG ON
	(
	    name = ' + QUOTENAME(@dbName + '_Log') + N',
	    filename = ''' + @dbLog + N''',
	    size = 5MB,
	    maxsize = 50MB,
	    filegrowth = 1MB
	);'

	exec sp_executesql @sql

	insert into Tenant
	(TenantID,CompanyName,DBPath,DBLogPath,CreatedDate)
	values
	(@TenantID,@CompanyName,@dbFile,@dbLog,@d1)
	
	-- create member table
	set @sql = N'
	create table ['+ @dbName +'].[dbo].[Member](
	[UserID] [varchar](5) NOT NULL,
	[UserName] [nvarchar](100) NULL,
	[Email] [varchar](100) NULL,
	[Password] [varchar](20) NULL,
	[Position] [varchar](10) NULL,
	[MobileNo] [varchar](50) NULL,
	[ProfileImage] [varchar](20) NULL,
	[UserRole] [varchar](10) NULL,
	[CreatedBy] [varchar](5) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](5) NULL,
	[UpdatedDate] [datetime] NULL,
	CONSTRAINT [PK_Member] PRIMARY KEY CLUSTERED 
	(
		[UserID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]
	
	create table ['+ @dbName +'].dbo.[DutyPlan](
	[DutyID] [int] IDENTITY(1,1) NOT NULL,
	[UserID] [varchar](5) NOT NULL,
	[DutyDate] [date] NULL,
	[DeleteFlg] [bit] NOT NULL,
	[CreatedBy] [varchar](5) NULL,
	[CreatedDate] [datetime] NULL,
	[UpdatedBy] [varchar](5) NULL,
	[UpdatedDate] [datetime] NULL,
	CONSTRAINT [PK_DutyPlan] PRIMARY KEY CLUSTERED 
	(
		[DutyID] ASC
	)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
	) ON [PRIMARY]

	ALTER TABLE ['+ @dbName +'].[dbo].[DutyPlan] ADD  CONSTRAINT [DF_DutyPlan_DeleteFlg]  DEFAULT ((0)) FOR [DeleteFlg]
	'
	exec sp_executesql @sql

	-- create new member
	exec dbo.Member_Process @dbName,NULL,@UserName,@Email,@Password,@Position,@MobileNumber,'default.png','admin','New','00000'


END
GO
/****** Object:  StoredProcedure [dbo].[DutyPlan_Process]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DutyPlan_Process] 
	@Mode varchar(10),
	@TenantID varchar(10),
	@DutyDate date,
	@UserID varchar(5),
	@CreatedBy varchar(5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    declare @d1 as datetime = getdate()

	declare @sql as nvarchar(max) 
	
	if @Mode = 'New'
		begin

			set @sql = N'
				    insert into [ScheduleKanri_' + @TenantID + '].dbo.DutyPlan
				    (UserID, DutyDate, DeleteFlg, CreatedBy, CreatedDate)
				    values
				    (@UserID, @DutyDate, 0, @CreatedBy, @CreatedDate);
				';

			exec sp_executesql @sql,
				N'@UserID varchar(5), @DutyDate date, @CreatedBy varchar(10), @CreatedDate datetime',
				@UserID, @DutyDate, @CreatedBy, @d1;

		end
	else if @Mode = 'Delete'
		begin

			set @sql = N'
				    delete from [ScheduleKanri_' + @TenantID + '].dbo.DutyPlan
				    where UserID = @UserID and DutyDate = @DutyDate
				';

			exec sp_executesql @sql,
				N'@UserID varchar(5), @DutyDate date',
				@UserID, @DutyDate

		end
		
END
GO
/****** Object:  StoredProcedure [dbo].[DutyPlan_Select]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[DutyPlan_Select]
	@TenantID varchar(10) = '001',	
	@YYYY as int,
	@MM as int,
	@UserID as varchar(5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @sql as nvarchar(max) = N'
		select 
			m1.UserID,m1.UserName,m1.UserRole,m1.ProfileImage,day(dp1.DutyDate) as DutyDay
		from [ScheduleKanri_' + @TenantID + '].dbo.[Member] m1
		left join [ScheduleKanri_' + @TenantID + '].dbo.DutyPlan dp1 on m1.UserID = dp1.UserID and year(dp1.DutyDate) = @YYYY and month(dp1.DutyDate) = @MM
		where (@UserID is null or m1.UserID = @UserID)
		order by m1.UserName
	'

    exec sp_executesql @sql,
    N'@YYYY int, @MM int, @UserID varchar(5)',
    @YYYY,@MM,@UserID
END
GO
/****** Object:  StoredProcedure [dbo].[Member_LoginCheck]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Member_LoginCheck]
	@TenantID varchar(10),
	@Email varchar(100),
	@Password varchar(20)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    declare @sql as nvarchar(max) = N'
	select UserID,UserName,ProfileImage,UserRole,''' + @TenantID + ''' as TenantID from [ScheduleKanri_' + @TenantID + '].dbo.Member
	where Email = @Email and [Password] = @Password
	'
	exec sp_executesql @sql,
    N'@Email varchar(100), @Password varchar(20)',
    @Email,@Password;
END
GO
/****** Object:  StoredProcedure [dbo].[Member_Process]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Member_Process]
	@Database varchar(100),
	@UserID varchar(5),
	@UserName nvarchar(100),
	@Email varchar(100),
	@Password varchar(10),
	@Position varchar(10),
	@MobileNo varchar(50),
	@ProfileImage varchar(20),
	@UserRole varchar(10),
	@Mode varchar(10),
	@CreatedBy varchar(5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @d1 as datetime = getdate()

	declare @sql as nvarchar(max) 
	
	if @Mode = 'New'
		begin
			
			declare @NewUserID as varchar(5)

			set @sql = N'
			    select @NewUserID = format(ISNULL(MAX(UserID), 0) + 1, ''00000'')
			    from [' + @Database + '].dbo.Member;
			';

			exec sp_executesql @sql, N'@NewUserID VARCHAR(5) OUTPUT', @NewUserID OUTPUT;

			set @UserID = @NewUserID

			set @sql = N'
			    insert into [' + @Database + '].dbo.Member
			    (UserID, UserName, Email, Password, Position, MobileNo, ProfileImage, UserRole, CreatedBy, CreatedDate)
			    values
			    (@NewUserID, @UserName, @Email, @Password, @Position, @MobileNo, @ProfileImage, @UserRole, @CreatedBy, @CreatedDate);
			';

			if @ProfileImage is null
				set @ProfileImage = @UserID + '.png'


			exec sp_executesql @sql,
			N'@NewUserID varchar(5), @UserName nvarchar(100), @Email varchar(100), 
			  @Password varchar(20), @Position varchar(10), @MobileNo varchar(50), 
			  @ProfileImage varchar(20), @UserRole varchar(10),
			  @CreatedBy varchar(5), @CreatedDate datetime',
			@NewUserID, @UserName, @Email, @Password, @Position, @MobileNo, @ProfileImage, @UserRole, @CreatedBy, @d1;
		end
	else if @Mode = 'Edit'
		begin
			set @sql = N'
			    update [' + @Database + '].dbo.Member
			    set 
					UserName = @UserName,
					Email = @Email,
					[Password] = @Password,
					Position = @Position,
					MobileNo = @MobileNo,
					UserRole = @UserRole,
					ProfileImage = case when @ProfileImage is null then ProfileImage else @ProfileImage end,
					UpdatedBy = @CreatedBy,
					UpdatedDate = @CreatedDate
				where
					UserID = @UserID
			';

			exec sp_executesql @sql,
			N'@UserID varchar(5), @UserName nvarchar(100), @Email varchar(100), 
			  @Password varchar(20), @Position varchar(10), @MobileNo varchar(50), 
			  @UserRole varchar(10), @ProfileImage varchar(20), @CreatedBy varchar(5), @CreatedDate datetime',
			@UserID, @UserName, @Email, @Password, @Position, @MobileNo, @UserRole, @ProfileImage, @CreatedBy, @d1;
		end

	else if @Mode = 'Delete'
		begin
			
			set @sql = N'
			    delete [' + @Database + '].dbo.Member
				where
					UserID = @UserID
			';

			exec sp_executesql @sql,
			N'@UserID varchar(5)',
			@UserID;
		end

	select @UserID as UserID
END
GO
/****** Object:  StoredProcedure [dbo].[Member_Select]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Member_Select] 
	@TenantID varchar(10) = '001',
	@UserName nvarchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	declare @sql as nvarchar(max) = N'
	select 
		UserID,UserName,[Password],Email,Position,UserRole,ProfileImage,MobileNo as MobileNumber,CreatedDate from [ScheduleKanri_' + @TenantID + '].dbo.Member
		where @UserName is null or (UserName LIKE ''%'' + @UserName + ''%'')
		order by CreatedDate desc
	'
	 -- Execute the dynamic SQL with the parameter
    exec sp_executesql @sql,
    N'@UserName nvarchar(100)',
    @UserName 
END
GO
/****** Object:  StoredProcedure [dbo].[Tenant_Select]    Script Date: 2025-01-29 13:16:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[Tenant_Select]
	@TenantID varchar(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    select 
		TenantID,
		CompanyName
	from
		Tenant
	where
		TenantID = @TenantID
END
GO
