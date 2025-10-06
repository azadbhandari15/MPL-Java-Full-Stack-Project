package com.mpl.auctionbackend.auctionbackend.entity;

import com.mpl.auctionbackend.auctionbackend.entity.model.PlayerAuctionStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@ToString
@Table(name = "players")
public class PlayerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playerName;
    private String mobileNumber;
    private String role;
    private String url;
    private Integer basePoint;
    private Integer soldAmount;
    private String playerId;
    @Enumerated(EnumType.STRING)
    private PlayerAuctionStatus playerAuctionStatus;
    @ManyToOne
    @JoinColumn(name = "player_team_id",referencedColumnName = "id")
    private PlayerTeamEntity playerTeamEntity;
}
