declare namespace API {
  type BaseResponseBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseListMoneyInfo_ = {
    code?: number
    data?: MoneyInfo[]
    message?: string
  }

  type BaseResponseListOrder_ = {
    code?: number
    data?: Order[]
    message?: string
  }

  type BaseResponseListOrderGroup_ = {
    code?: number
    data?: OrderGroup[]
    message?: string
  }

  type BaseResponseListOrderGroupSelectInfoVO_ = {
    code?: number
    data?: OrderGroupSelectInfoVO[]
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

  type BaseResponsePageOrder_ = {
    code?: number
    data?: PageOrder_
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

  type checkoutUsingPOSTParams = {
    /** orderId */
    orderId?: number
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

  type listGroupMoneyInfoByOrderIdUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type listMoneyInfoByOrderIdUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type listOrderGroupDataUsingPOSTParams = {
    /** orderId */
    orderId?: number
  }

  type listOrderGroupSelectInfoUsingPOSTParams = {
    /** orderId */
    orderId?: number
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

  type MoneyInfo = {
    createTime?: string
    id?: number
    isDelete?: number
    money?: number
    moneyType?: string
    operator?: string
    orderId?: number
    payInfo?: string
    payTime?: string
    roomId?: string
    updateTime?: string
  }

  type MoneyInfoFeeRequest = {
    money?: number
    orderId?: number
    payInfo?: string
    payTime?: string
  }

  type Order = {
    cardType?: string
    consume?: number
    createTime?: string
    customType?: number
    endTime?: string
    id?: number
    idCard?: string
    isDelete?: number
    name?: string
    orderGroupId?: number
    orderInfo?: string
    orderState?: number
    pay?: number
    phone?: string
    restMoney?: number
    roomId?: string
    roomPrice?: number
    roomType?: string
    startTime?: string
    updateTime?: string
  }

  type OrderChangeRoomPriceRequest = {
    orderId?: number
    payInfo?: string
    roomPrice?: number
  }

  type OrderChangeRoomRequest = {
    orderId?: number
    payInfo?: string
    roomId?: string
    roomPrice?: number
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

  type OrderContactRequest = {
    orderGroupId?: number
    orderGroupSelectInfoList?: OrderGroupSelectInfoVO[]
  }

  type OrderGroup = {
    createTime?: string
    id?: number
    isDelete?: number
    state?: number
    updateTime?: string
  }

  type OrderGroupSelectInfoVO = {
    id?: number
    orderList?: Order[]
  }

  type OrderQueryRequest = {
    cardType?: string
    consume?: number
    createTime?: string
    current?: number
    customType?: number
    endTime?: string
    id?: number
    idCard?: string
    name?: string
    orderGroupId?: number
    orderInfo?: string
    orderState?: number
    pageSize?: number
    pay?: number
    phone?: string
    restMoney?: number
    roomId?: string
    roomPrice?: number
    roomType?: string
    shopConsume?: number
    sortField?: string
    sortOrder?: string
    startTime?: string
    updateTime?: string
  }

  type OrderUpdateRequest = {
    cardType?: string
    consume?: number
    customType?: number
    id?: number
    idCard?: string
    name?: string
    orderGroupId?: number
    orderInfo?: string
    orderState?: number
    pay?: number
    phone?: string
    restMoney?: number
    roomId?: string
    roomPrice?: number
    roomType?: string
    shopConsume?: number
  }

  type PageOrder_ = {
    current?: number
    pages?: number
    records?: Order[]
    size?: number
    total?: number
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
    roomPeopleNum?: string
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
