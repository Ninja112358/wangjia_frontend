declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseListRoom_ = {
    code?: number
    data?: Room[]
    message?: string
  }

  type BaseResponseListRoomType_ = {
    code?: number
    data?: RoomType[]
    message?: string
  }

  type BaseResponseLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponsePageRoom_ = {
    code?: number
    data?: PageRoom_
    message?: string
  }

  type BaseResponsePageRoomType_ = {
    code?: number
    data?: PageRoomType_
    message?: string
  }

  type BaseResponsePageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type BaseResponseString_ = {
    code?: number
    data?: string
    message?: string
  }

  type BaseResponseUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type DeleteRequest = {
    id?: number
  }

  type downloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type LoginUserVO = {
    createTime?: string
    editTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type OrderCheckInRequest = {
    cardType?: string
    customType?: number
    idCard?: string
    name?: string
    orderInfo?: string
    pay?: number
    phone?: string
    roomList?: RoomCheckInRequest[]
  }

  type PageRoom_ = {
    current?: number
    pages?: number
    records?: Room[]
    size?: number
    total?: number
  }

  type PageRoomType_ = {
    current?: number
    pages?: number
    records?: RoomType[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type Room = {
    createTime?: string
    id?: number
    isContact?: boolean
    isDelete?: number
    isTeam?: boolean
    isWindow?: string
    orderId?: number
    roomCustom?: string
    roomFloor?: number
    roomId?: string
    roomInfo?: string
    roomPeopleNum?: number
    roomPrice?: number
    roomState?: number
    roomType?: string
    updateTime?: string
  }

  type RoomAddRequest = {
    isWindow?: string
    roomFloor?: number
    roomId?: string
    roomInfo?: string
    roomPeopleNum?: number
    roomPrice?: number
    roomType?: string
  }

  type RoomCheckInRequest = {
    roomId?: string
    roomPrice?: number
    roomType?: string
  }

  type RoomQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type RoomSetStateRequest = {
    id?: number
    roomState?: number
  }

  type RoomType = {
    createTime?: string
    id?: number
    isDelete?: number
    name?: string
    peopleNum?: number
    price?: number
    updateTime?: string
  }

  type RoomTypeAddRequest = {
    name?: string
    peopleNum?: number
    price?: number
  }

  type RoomTypeQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type RoomTypeUpdateRequest = {
    id?: number
    name?: string
    peopleNum?: number
    price?: number
  }

  type RoomUpdateRequest = {
    id?: number
    isWindow?: string
    roomFloor?: number
    roomId?: string
    roomInfo?: string
    roomPeopleNum?: number
    roomPrice?: number
    roomType?: string
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserQueryRequest = {
    current?: number
    id?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
